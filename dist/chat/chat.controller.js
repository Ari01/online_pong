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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const _2fa_guard_1 = require("../auth/2fa/2fa.guard");
const channel_service_1 = require("./channel.service");
const message_service_1 = require("./message.service");
let ChatController = class ChatController {
    constructor(channelService, messageService) {
        this.channelService = channelService;
        this.messageService = messageService;
    }
    async getPrivateChannels(req) {
        const chans = await this.channelService.getPrivateChannels(req.user.id);
        return chans;
    }
    async getPublicChannels(req) {
        const chans = await this.channelService.getPublicChannels();
        return chans;
    }
    async getNewMessages(req) {
        const convs = await this.messageService.getNewMessages(req.user.id);
        return convs;
    }
};
__decorate([
    (0, common_1.Get)("privateChannels"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getPrivateChannels", null);
__decorate([
    (0, common_1.Get)("publicChannels"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getPublicChannels", null);
__decorate([
    (0, common_1.Get)("getNewMessages"),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getNewMessages", null);
ChatController = __decorate([
    (0, common_1.Controller)("chat"),
    __metadata("design:paramtypes", [channel_service_1.ChannelService,
        message_service_1.MessageService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map