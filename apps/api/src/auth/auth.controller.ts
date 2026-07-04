import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token requerido');
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });
      return this.authService.refreshToken(payload.sub);
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  @Post('mfa/activate')
  @UseGuards(JwtAuthGuard)
  activateMfa(@Req() req: any) {
    return this.authService.activateMfa(req.user.id);
  }

  @Post('mfa/verify')
  @UseGuards(JwtAuthGuard)
  verifyMfa(@Req() req: any, @Body('token') token: string) {
    return this.authService.verifyMfa(req.user.id, token);
  }
}