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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestrictionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_1 = require("../database");
const typeorm_2 = require("typeorm");
const channel_service_1 = require("./channel.service");
let RestrictionService = class RestrictionService {
    constructor(restrictionRepo, chanRepo, chanService) {
        this.restrictionRepo = restrictionRepo;
        this.chanRepo = chanRepo;
        this.chanService = chanService;
    }
    async isMuted(userId, channel) {
        if (!channel.muted || !channel.muted.length)
            return false;
        const restriction = channel.muted.find((restrict) => restrict.userId === userId);
        if (restriction) {
            if (restriction.end <= new Date()) {
                await this.restrictionRepo.remove(restriction);
                return false;
            }
            return true;
        }
        return false;
    }
    async isBanned(userId, channel) {
        if (!channel.banned || !channel.banned.length)
            return false;
        const restriction = channel.banned.find((restrict) => restrict.userId === userId);
        if (restriction) {
            if (restriction.end <= new Date()) {
                await this.restrictionRepo.remove(restriction);
                return false;
            }
            return true;
        }
        return false;
    }
    async getMutedId(userId, channel) {
        if (!channel.muted || !channel.muted.length)
            return -1;
        const restriction = channel.muted.findIndex((restrict) => restrict.userId === userId);
        return restriction;
    }
    async getBannedId(userId, channel) {
        if (!channel.banned || !channel.banned.length)
            return -1;
        const restriction = channel.banned.findIndex((restrict) => restrict.userId === userId);
        return restriction;
    }
    async getMuted(userId, channel) {
        if (!channel.muted || !channel.muted.length)
            return null;
        const restriction = channel.muted.find((restrict) => restrict.userId === userId);
        return restriction;
    }
    async getBanned(userId, channel) {
        if (!channel.banned || !channel.banned.length)
            return null;
        const restriction = channel.banned.find((restrict) => restrict.userId === userId);
        return restriction;
    }
    async ban(user, channel, date) {
        if (channel.owner.id === user.id)
            return null;
        const restrictionId = await this.getBannedId(user.id, channel);
        if (restrictionId >= 0) {
            channel.banned[restrictionId].end = date;
        }
        else {
            let restrict = this.restrictionRepo.create({
                userId: user.id,
                end: date,
            });
            restrict = await this.restrictionRepo.save(restrict);
            channel.banned.push(restrict);
        }
        return await this.chanRepo.save(channel);
    }
    async mute(user, channel, date) {
        if (channel.owner.id === user.id)
            return null;
        const restrictionId = await this.getMutedId(user.id, channel);
        if (restrictionId >= 0)
            channel.muted[restrictionId].end = date;
        else {
            let restrict = this.restrictionRepo.create({
                userId: user.id,
                end: date,
            });
            restrict = await this.restrictionRepo.save(restrict);
            channel.muted.push(restrict);
        }
        channel = await this.chanRepo.save(channel);
        return channel;
    }
};
RestrictionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(database_1.Restriction)),
    __param(1, (0, typeorm_1.InjectRepository)(database_1.Channel)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, channel_service_1.ChannelService])
], RestrictionService);
exports.RestrictionService = RestrictionService;
//# sourceMappingURL=restrictions.service.js.map