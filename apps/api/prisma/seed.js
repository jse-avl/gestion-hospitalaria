"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = require("bcryptjs");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var passwordHash, adminUser, sucCentral, sucSanMiguelito, sucJuanDiaz, espCardio, espPedia, espMedicina, espGineco, espDerma, _i, _a, s, _b, _c, e, doctores, _d, doctores_1, d, user, recepUser;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, bcrypt.hash('123456', 12)];
                case 1:
                    passwordHash = _e.sent();
                    return [4 /*yield*/, prisma.usuario.upsert({
                            where: { email: 'admin@sistema.gob.pa' },
                            update: {},
                            create: {
                                email: 'admin@sistema.gob.pa',
                                passwordHash: passwordHash,
                                nombre: 'Admin Sistema',
                                rol: client_1.Rol.ADMIN,
                            },
                        })];
                case 2:
                    adminUser = _e.sent();
                    return [4 /*yield*/, prisma.sucursal.create({
                            data: {
                                nombre: 'Policlínica Central',
                                direccion: 'Av. Central, Ciudad de Panamá',
                                telefono: '+507 200-0001',
                                horario: { lunes: '07:00-15:00', martes: '07:00-15:00', miercoles: '07:00-15:00', jueves: '07:00-15:00', viernes: '07:00-15:00' },
                                latitud: 8.9824,
                                longitud: -79.5199,
                            },
                        })];
                case 3:
                    sucCentral = _e.sent();
                    return [4 /*yield*/, prisma.sucursal.create({
                            data: {
                                nombre: 'Policlínica San Miguelito',
                                direccion: 'Vía Simón Bolívar, San Miguelito',
                                telefono: '+507 200-0002',
                                horario: { lunes: '07:00-15:00', martes: '07:00-15:00', miercoles: '07:00-15:00', jueves: '07:00-15:00', viernes: '07:00-15:00' },
                                latitud: 9.0324,
                                longitude: -79.5066,
                            },
                        })];
                case 4:
                    sucSanMiguelito = _e.sent();
                    return [4 /*yield*/, prisma.sucursal.create({
                            data: {
                                nombre: 'Policlínica Juan Díaz',
                                direccion: 'Vía España, Juan Díaz',
                                telefono: '+507 200-0003',
                                horario: { lunes: '07:00-15:00', martes: '07:00-15:00', miercoles: '07:00-15:00', jueves: '07:00-15:00', viernes: '07:00-15:00' },
                                latitud: 9.0153,
                                longitud: -79.4687,
                            },
                        })];
                case 5:
                    sucJuanDiaz = _e.sent();
                    return [4 /*yield*/, prisma.especialidad.create({ data: { nombre: 'Cardiología', descripcion: 'Atención cardiológica general', cupoMaximo: 20 } })];
                case 6:
                    espCardio = _e.sent();
                    return [4 /*yield*/, prisma.especialidad.create({ data: { nombre: 'Pediatría', descripcion: 'Atención pediátrica', cupoMaximo: 25 } })];
                case 7:
                    espPedia = _e.sent();
                    return [4 /*yield*/, prisma.especialidad.create({ data: { nombre: 'Medicina General', descripcion: 'Consulta general', cupoMaximo: 30 } })];
                case 8:
                    espMedicina = _e.sent();
                    return [4 /*yield*/, prisma.especialidad.create({ data: { nombre: 'Ginecología', descripcion: 'Atención ginecológica', cupoMaximo: 15 } })];
                case 9:
                    espGineco = _e.sent();
                    return [4 /*yield*/, prisma.especialidad.create({ data: { nombre: 'Dermatología', descripcion: 'Atención dermatológica', cupoMaximo: 15 } })];
                case 10:
                    espDerma = _e.sent();
                    _i = 0, _a = [sucCentral, sucSanMiguelito, sucJuanDiaz];
                    _e.label = 11;
                case 11:
                    if (!(_i < _a.length)) return [3 /*break*/, 16];
                    s = _a[_i];
                    _b = 0, _c = [espCardio, espPedia, espMedicina, espGineco, espDerma];
                    _e.label = 12;
                case 12:
                    if (!(_b < _c.length)) return [3 /*break*/, 15];
                    e = _c[_b];
                    return [4 /*yield*/, prisma.sucursalEspecialidad.create({ data: { sucursalId: s.id, especialidadId: e.id } })];
                case 13:
                    _e.sent();
                    _e.label = 14;
                case 14:
                    _b++;
                    return [3 /*break*/, 12];
                case 15:
                    _i++;
                    return [3 /*break*/, 11];
                case 16:
                    doctores = [
                        { email: 'martinez@correo.pa', nombre: 'Dr. Martínez', esp: espCardio, suc: sucCentral },
                        { email: 'rios@correo.pa', nombre: 'Dra. Ríos', esp: espCardio, suc: sucSanMiguelito },
                        { email: 'mora@correo.pa', nombre: 'Dr. Mora', esp: espCardio, suc: sucJuanDiaz },
                        { email: 'lopez@correo.pa', nombre: 'Dra. López', esp: espPedia, suc: sucCentral },
                        { email: 'perez@correo.pa', nombre: 'Dr. Pérez', esp: espMedicina, suc: sucCentral },
                    ];
                    _d = 0, doctores_1 = doctores;
                    _e.label = 17;
                case 17:
                    if (!(_d < doctores_1.length)) return [3 /*break*/, 21];
                    d = doctores_1[_d];
                    return [4 /*yield*/, prisma.usuario.create({
                            data: { email: d.email, passwordHash: passwordHash, nombre: d.nombre, rol: client_1.Rol.DOCTOR },
                        })];
                case 18:
                    user = _e.sent();
                    return [4 /*yield*/, prisma.doctor.create({
                            data: { usuarioId: user.id, especialidadId: d.esp.id, sucursalId: d.suc.id },
                        })];
                case 19:
                    _e.sent();
                    _e.label = 20;
                case 20:
                    _d++;
                    return [3 /*break*/, 17];
                case 21: return [4 /*yield*/, prisma.usuario.create({
                        data: { email: 'recepcion@correo.pa', passwordHash: passwordHash, nombre: 'María Recepcionista', rol: client_1.Rol.RECEPCIONISTA },
                    })];
                case 22:
                    recepUser = _e.sent();
                    console.log('Seed completed successfully');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) { console.error(e); process.exit(1); })
    .finally(function () { return prisma.$disconnect(); });
