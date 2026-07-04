import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email ya registrado');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const usuario = await this.prisma.usuario.create({
      data: {
        email: dto.email,
        passwordHash,
        nombre: dto.nombre,
        rol: dto.rol ?? 'PACIENTE',
      },
    });

    if (dto.cedula) {
      await this.prisma.paciente.create({
        data: { usuarioId: usuario.id, cedula: dto.cedula, telefono: dto.telefono },
      });
    }

    return this.generateTokens(usuario);
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    if (!usuario.activo) throw new UnauthorizedException('Usuario inactivo');

    const now = new Date();
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: now },
    });

    const tokens = await this.generateTokens(usuario);

    return {
      ...tokens,
      necesitaMfa: usuario.mfaActivo,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        activo: usuario.activo,
        mfaActivo: usuario.mfaActivo,
      },
    };
  }

  async refreshToken(userId: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!usuario || !usuario.activo) throw new UnauthorizedException('Usuario inválido');
    return this.generateTokens(usuario);
  }

  async activateMfa(userId: string) {
    const secret = speakeasy.generateSecret({ length: 20, name: `CitasMedicas:${userId}` });
    await this.prisma.usuario.update({
      where: { id: userId },
      data: { mfaSecreto: secret.base32, mfaActivo: true },
    });
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);
    return { secret: secret.base32, qrCode };
  }

  async verifyMfa(userId: string, token: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!usuario?.mfaSecreto) throw new UnauthorizedException('MFA no configurado');

    const valid = speakeasy.totp.verify({
      secret: usuario.mfaSecreto,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (!valid) throw new UnauthorizedException('Código MFA inválido');
    return { verified: true };
  }

  private async generateTokens(usuario: any) {
    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        expiresIn: '7d',
      }),
    };
  }
}