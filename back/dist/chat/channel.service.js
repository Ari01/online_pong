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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_1 = require("../database");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const notifs_service_1 = require("../users/notifs.service");
let ChannelService = class ChannelService {
    constructor(chanRepo, msgRepo, userRepo, restrictionRepo, notifService) {
        this.chanRepo = chanRepo;
        this.msgRepo = msgRepo;
        this.userRepo = userRepo;
        this.restrictionRepo = restrictionRepo;
        this.notifService = notifService;
    }
    async findChannel(name, type) {
        const channel = await this.chanRepo.find({
            where: {
                name,
                type,
            },
        });
        return channel[0];
    }
    async findChannelById(id) {
        const channel = await this.chanRepo.findOne({
            where: {
                id,
            },
            relations: {
                users: true,
                owner: true,
                banned: true,
                admins: true,
                muted: true,
                messages: {
                    from: true,
                },
            },
            order: {
                messages: {
                    id: "ASC",
                },
            },
        });
        return channel;
    }
    async getChannelWithUsers(id) {
        const channel = await this.chanRepo.find({
            where: {
                id,
            },
            relations: {
                users: true,
                owner: true,
            },
        });
        channel[0].password = null;
        return channel[0];
    }
    async getPublicChannels() {
        const tmp = await this.chanRepo.find({
            where: [{ type: "public" }, { type: "protected" }],
            relations: {
                owner: true,
                users: true,
                banned: true,
            },
        });
        const chans = tmp.map((chan) => {
            chan.password = null;
            return chan;
        });
        return chans;
    }
    async getPrivateChannels(userId) {
        const tmp = await this.chanRepo
            .createQueryBuilder("channels")
            .leftJoinAndSelect("channels.users", "user")
            .leftJoinAndSelect("channels.owner", "owner")
            .leftJoinAndSelect("channels.banned", "banned")
            .where("channels.type = :type", { type: "private" })
            .andWhere("user.id = :userId", { userId })
            .getMany();
        const chans = tmp.map((chan) => {
            return Object.assign(Object.assign({}, chan), { password: null });
        });
        return chans;
    }
    async getChannels(userId) {
        const publicChans = await this.getPublicChannels();
        const privateChans = await this.getPrivateChannels(userId);
        const ret = publicChans.concat(privateChans);
        return ret;
    }
    async checkChanData(chanData) {
        if (!chanData.name)
            return "invalid channel name";
        if (chanData.type === "public" || chanData.type === "protected") {
            const chan = (await this.findChannel(chanData.name, "public")) ||
                (await this.findChannel(chanData.name, "protected"));
            if (chan)
                return "invalid channel name";
        }
        else if (await this.findChannel(chanData.name, "private"))
            return "invalid channel name";
        if (chanData.type === "protected" && !chanData.password)
            return "invalid password";
        return null;
    }
    async checkChanPassword(pass, cryptedPass) {
        return await bcrypt.compare(pass, cryptedPass);
    }
    async setChanPassword(channel, pass) {
        await this.chanRepo.update(channel.id, {
            password: await bcrypt.hash(pass, 10),
            type: "protected",
        });
        let chan = await this.findChannelById(channel.id);
        return chan;
    }
    async removeChanPassword(channel) {
        channel.password = null;
        channel.type = "public";
        return await this.chanRepo.save(channel);
    }
    async setChanOwner(user, channel) {
        channel.owner = user;
        return await this.chanRepo.save(channel);
    }
    async addUserChan(user, chan, role) {
        chan[role].push(user);
        return await this.chanRepo.save(chan);
    }
    async createChannel(chanData) {
        let hashedPassword = null;
        if (chanData.type === "protected")
            hashedPassword = await bcrypt.hash(chanData.password, 10);
        let channel = this.chanRepo.create({
            name: chanData.name,
            type: chanData.type,
            socketId: `${chanData.type}/${chanData.name}`,
            password: hashedPassword,
        });
        await this.chanRepo.save(channel);
        channel = await this.findChannelById(channel.id);
        channel = await this.setChanOwner(chanData.owner, channel);
        channel = await this.addUserChan(chanData.owner, channel, "users");
        return channel;
    }
    findUserInChan(userId, channel) {
        if (!channel.users)
            return false;
        const found = channel.users.find((user) => user.id === userId);
        return found;
    }
    async removeUserChan(user, chan) {
        chan.admins = chan.admins.filter((u) => u.id !== user.id);
        chan.users = chan.users.filter((u) => u.id !== user.id);
        return this.chanRepo.save(chan);
    }
    async deleteChan(chan) {
        const notifs = await this.notifService.getChanNotifs(chan);
        chan.banned.forEach(async (ban) => {
            await this.restrictionRepo.remove(ban);
        });
        chan.muted.forEach(async (mute) => {
            await this.restrictionRepo.remove(mute);
        });
        notifs.forEach(async (notif) => {
            await this.notifService.deleteNotif(notif);
        });
        await this.chanRepo
            .createQueryBuilder()
            .relation(database_1.Channel, "messages")
            .of(chan)
            .remove(chan.messages);
        await this.chanRepo
            .createQueryBuilder("channels")
            .delete()
            .from(database_1.Channel)
            .where("id = :id", { id: chan.id })
            .execute();
    }
    async leaveChan(user, chan) {
        let channel = await this.findChannelById(chan.id);
        channel = await this.removeUserChan(user, channel);
        if (channel.owner.id === user.id) {
            if (channel.admins && channel.admins[0])
                channel = await this.setChanOwner(channel.admins[0], channel);
            else if (channel.users && channel.users[0])
                channel = await this.setChanOwner(channel.users[0], channel);
            else if (channel.type === "private") {
                await this.deleteChan(channel);
                return null;
            }
            else
                channel = await this.setChanOwner(null, channel);
        }
        return channel;
    }
};
ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(database_1.Channel)),
    __param(1, (0, typeorm_1.InjectRepository)(database_1.ChanMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(database_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(database_1.Restriction)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, notifs_service_1.NotifService])
], ChannelService);
exports.ChannelService = ChannelService;
//# sourceMappingURL=channel.service.js.map