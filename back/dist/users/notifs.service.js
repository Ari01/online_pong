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
exports.NotifService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_1 = require("../database");
const typeorm_2 = require("typeorm");
const users_service_1 = require("./users.service");
let NotifService = class NotifService {
    constructor(notifRepository, userService) {
        this.notifRepository = notifRepository;
        this.userService = userService;
    }
    async createNotif(data) {
        const notifs = await this.findNotif(data);
        if (!notifs) {
            console.log("notif not found, creating new");
            const newNotif = this.notifRepository.create(data);
            console.log("newNotif", newNotif);
            return this.notifRepository.save(newNotif);
        }
        console.log("notif not created");
        return null;
    }
    async findChanInvite(data) {
        const notif = await this.notifRepository.findOne({
            relations: {
                to: true,
                from: true,
                channel: true,
            },
            where: {
                to: {
                    id: data.to.id,
                },
                from: {
                    id: data.from.id,
                },
                channel: {
                    id: data.channel.id,
                },
                type: data.type,
            },
        });
        console.log("chanNotif", notif);
        return notif;
    }
    async findNotif(data) {
        console.log("find one notif");
        if (data.channel)
            return await this.findChanInvite(data);
        const notif = await this.notifRepository.findOne({
            relations: {
                to: true,
                from: true,
            },
            where: {
                to: {
                    id: data.to.id,
                },
                from: {
                    id: data.from.id,
                },
                type: data.type,
            },
        });
        console.log("friendNotif");
        return notif;
    }
    async getNotifs(userId) {
        console.log("getNotifs");
        return await this.notifRepository.find({
            relations: {
                to: true,
                from: true,
                channel: true,
            },
            where: {
                to: {
                    id: userId,
                },
            },
        });
    }
    async getChanNotifs(channel) {
        const notifs = await this.notifRepository.find({
            relations: {
                channel: true,
            },
            where: {
                channel: {
                    id: channel.id,
                },
            },
        });
        return notifs;
    }
    async deleteNotif(notif) {
        await this.notifRepository.remove(notif);
    }
};
NotifService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(database_1.Notif)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], NotifService);
exports.NotifService = NotifService;
//# sourceMappingURL=notifs.service.js.map