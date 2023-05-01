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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../database");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const _2fa_guard_1 = require("../auth/2fa/2fa.guard");
const users_service_1 = require("./users.service");
const notifs_service_1 = require("./notifs.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
class PostDTO {
}
let UsersController = class UsersController {
    constructor(userRepository, usersService, notifService) {
        this.userRepository = userRepository;
        this.usersService = usersService;
        this.notifService = notifService;
    }
    async findMe(req) {
        const user = await this.userRepository.findOneBy({ id: req.user.id });
        return user;
    }
    async findOneById(params) {
        console.log("🚀 ~ file: users.controller.ts:49 ~ UsersController ~ findOneById ~ params", params);
        const user = await this.userRepository.findOneBy({
            id: parseInt(params.id),
        });
        console.log("get profile", user.username);
        return user;
    }
    async findOneByUsername(params) {
        const user = await this.userRepository.findOneBy({
            username: params.username,
        });
        return user;
    }
    async addFriend(req, { username }) {
        const user = await this.usersService.addFriend(req.user, username);
        return user;
    }
    async getFriends(req) {
        console.log("get friends");
        const users = await this.usersService.getFriends(req.user);
        return users;
    }
    async deleteFriend(req, { userId }) {
        const users = await this.usersService.deleteFriend(req.user, userId);
        return users;
    }
    async getNotifs(req) {
        const notifs = await this.notifService.getNotifs(req.user.id);
        console.log("notifs", notifs);
        return notifs;
    }
    async updateUser(req) {
        console.log("REQUEST BODY: ", req.body);
        const user = await this.usersService.updateUser(req.body.user);
        console.log("🚀 ~ file: users.controller.ts:109  UPDATEUSER", user);
        return user;
    }
    async updateUsername(req) {
        console.log("REQUEST BODY: ", req.body);
        const user = await this.usersService.updateUsername(req.body.id, req.body.username);
        return user;
    }
    async uploadAvatar(req, file) {
        console.log("🚀 ~ file: users.controller.ts:135 ~ UsersController ~ req", req);
        const ret = await this.usersService.uploadAvatar(req.user.id, file.filename);
        console.log("🚀 ~ file: users.controller.ts:138 ~ UsersController ~ ret", ret);
        return ret;
    }
    getAvatar(req, res) {
        const path = req.user.avatar;
        console.log("path", path);
        if (path)
            return res.sendFile(path, { root: "./uploads" });
        console.log("error geting avatar: invalid file path");
    }
    async getAvatarById(params, res) {
        const user = await this.usersService.getById(params.id);
        if (user && user.avatar)
            return res.sendFile(user.avatar, { root: "./uploads" });
        console.log("error getting avatar: invalid user or file path");
    }
    async blockUser(req, { userId }) {
        const user = await this.usersService.block(req.user.id, userId);
        return user;
    }
    async getGames(params) {
        console.log(`get games ${params.id}`);
        const games = await this.usersService.getGames(params.id);
        console.log("returned games", games);
        return games;
    }
};
__decorate([
    (0, common_1.Get)(""),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], UsersController.prototype, "findMe", null);
__decorate([
    (0, common_1.Get)("userid/:id"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], UsersController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Get)("username/:username"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], UsersController.prototype, "findOneByUsername", null);
__decorate([
    (0, common_1.Post)("addFriend"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Get)("friends"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Post)("deleteFriend"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteFriend", null);
__decorate([
    (0, common_1.Get)("notifs"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getNotifs", null);
__decorate([
    (0, common_1.Post)("updateUser"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)("updateUsername"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUsername", null);
__decorate([
    (0, common_1.Post)("uploadAvatar"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./uploads",
            filename: (req, file, callback) => {
                if (!file.originalname)
                    callback(new Error("error uploading avatar"), file.fieldname);
                else {
                    console.log("filename", file.originalname);
                    const filename = file.originalname;
                    callback(null, filename);
                }
            },
        }),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof Express !== "undefined" && (_e = Express.Multer) !== void 0 && _e.File) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Get)("getAvatar"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.Get)("getAvatar/:id"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAvatarById", null);
__decorate([
    (0, common_1.Post)("blockUser"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Get)("games/:id"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getGames", null);
UsersController = __decorate([
    (0, common_1.Controller)("users"),
    __param(0, (0, typeorm_2.InjectRepository)(database_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, users_service_1.UsersService,
        notifs_service_1.NotifService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map