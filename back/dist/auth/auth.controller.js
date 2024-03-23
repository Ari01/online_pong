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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const _42_guard_1 = require("./42auth/42.guard");
const _2fa_service_1 = require("./2fa/2fa.service");
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("./auth.service");
const _2fa_guard_1 = require("./2fa/2fa.guard");
const local_guard_1 = require("./local.guard");
const jwt_guard_1 = require("./2fa/jwt.guard");
let AuthController = class AuthController {
    constructor(twoFactorAuthenticationService, usersService, authService) {
        this.twoFactorAuthenticationService = twoFactorAuthenticationService;
        this.usersService = usersService;
        this.authService = authService;
    }
    login() {
        console.log("login");
        return;
    }
    logout(req) {
        const cookie = this.authService.getLogoutCookie();
        console.log("logout");
        req.res.setHeader("Set-Cookie", cookie);
        return;
    }
    async redirect(req, res) {
        console.log("redirect");
        const accessTokenCookie = this.authService.getCookieWithJwtToken(req.user.id);
        req.res.setHeader("Set-Cookie", [accessTokenCookie]);
        if (req.user.isTwoFactorAuthenticationEnabled)
            res.redirect(`${process.env.FRONT_URL}/login/2fa`);
        else {
            res.redirect(`${process.env.FRONT_URL}/login/redirect`);
            console.log("2fa is off, redirected ");
        }
    }
    async devLogin(req, { username }) {
        if (req.user) {
            const accessTokenCookie = this.authService.getCookieWithJwtToken(req.user.id);
            req.res.setHeader("Set-Cookie", [accessTokenCookie]);
        }
        return req.user;
    }
    async register(res, req) {
        console.log("2fa");
        console.log("req user", req.user);
        const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user);
        return this.twoFactorAuthenticationService.pipeQrCodeStream(res, otpauthUrl);
    }
    async turnOnTwoFactorAuthentication(req, { code }) {
        console.log("turn on", code);
        const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, req.user);
        if (!isCodeValid) {
            return false;
        }
        await this.usersService.turnOnTwoFactorAuthentication(req.user.id);
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(req.user.id, true);
        req.res.setHeader("Set-Cookie", [accessTokenCookie]);
        console.log("true");
        return true;
    }
    async turnOffTwoFactorAuthentication(req) {
        const ret = await this.usersService.turnOffTwoFactorAuthentication(req.user.id);
        return ret;
    }
    async authenticate(req, { code }) {
        console.log("2fa auth");
        const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, req.user);
        if (!isCodeValid)
            return null;
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(req.user.id, true);
        req.res.setHeader("Set-Cookie", [accessTokenCookie]);
        return req.user;
    }
};
__decorate([
    (0, common_1.Get)("login"),
    (0, common_1.UseGuards)(_42_guard_1.FortyTwoAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("redirect"),
    (0, common_1.UseGuards)(_42_guard_1.FortyTwoAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "redirect", null);
__decorate([
    (0, common_1.UseGuards)(local_guard_1.LocalAuthenticationGuard),
    (0, common_1.Post)("devlog"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "devLogin", null);
__decorate([
    (0, common_1.Post)("2fa/generate"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("2fa/turn-on"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "turnOnTwoFactorAuthentication", null);
__decorate([
    (0, common_1.Post)("2fa/turn-off"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "turnOffTwoFactorAuthentication", null);
__decorate([
    (0, common_1.Post)("2fa/authenticate"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticate", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [_2fa_service_1.TwoFactorAuthenticationService,
        users_service_1.UsersService,
        auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map