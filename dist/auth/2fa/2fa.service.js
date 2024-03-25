"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../database");
const otplib_1 = require("otplib");
const users_service_1 = require("../../users/users.service");
const qrcode_1 = require("qrcode");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let TwoFactorAuthenticationService = class TwoFactorAuthenticationService {
    constructor(usersService, userRepo) {
        this.usersService = usersService;
        this.userRepo = userRepo;
    }
    async generateTwoFactorAuthenticationSecret(user) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpauthUrl = otplib_1.authenticator.keyuri(user.email, "transcendence2fa", secret);
        await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
        return { otpauthUrl };
    }
    async pipeQrCodeStream(stream, otpauthUrl) {
        return (0, qrcode_1.toFileStream)(stream, otpauthUrl);
    }
    async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user) {
        const userWithSecret = await this.usersService.getUserWithSecret(user.id);
        console.log("user", user);
        console.log("userWithSecret", userWithSecret);
        console.log("code valid code", twoFactorAuthenticationCode);
        console.log("user2fa secret", userWithSecret.secret);
        return otplib_1.authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: userWithSecret.secret.key,
        });
    }
};
TwoFactorAuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(database_1.User)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        typeorm_2.Repository])
], TwoFactorAuthenticationService);
exports.TwoFactorAuthenticationService = TwoFactorAuthenticationService;
//# sourceMappingURL=2fa.service.js.map