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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_1 = require("../database");
const typeorm_2 = require("typeorm");
let MessageService = class MessageService {
    constructor(userRepo, msgRepo, dmRepo, convRepo) {
        this.userRepo = userRepo;
        this.msgRepo = msgRepo;
        this.dmRepo = dmRepo;
        this.convRepo = convRepo;
    }
    async findById(id) {
        const message = await this.msgRepo.find({
            where: {
                id,
            },
            relations: {
                from: true,
                channel: true,
            },
        });
        return message[0];
    }
    async createChanMessage(data) {
        let message = this.msgRepo.create({
            content: data.content,
            from: data.from,
            channel: data.channel,
        });
        message = await this.msgRepo.save(message);
        return message;
    }
    async getNewMessages(id) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user)
            return;
        let convs = await this.convRepo
            .createQueryBuilder("conv")
            .leftJoinAndSelect("conv.messages", "msg")
            .leftJoinAndSelect("conv.user1", "user1")
            .leftJoinAndSelect("conv.user2", "user2")
            .leftJoinAndSelect("msg.from", "from")
            .where("conv.user1.id = :uid1 AND conv.new1 = :new1", {
            uid1: id,
            new1: true,
        })
            .orWhere("conv.user2.id = :uid2 AND conv.new2 = :new2", {
            uid2: id,
            new2: true,
        })
            .orderBy({ "msg.id": "ASC" })
            .getMany();
        if (convs && user.blocked)
            convs = convs.filter((conv) => !user.blocked.includes(conv.user1.id) &&
                !user.blocked.includes(conv.user2.id));
        console.log("convs", convs);
        const ret = [];
        while (convs.length) {
            let conv = convs.shift();
            ret.push({
                id: conv.id,
                messages: conv.messages,
                to: conv.user1.id === id ? conv.user2 : conv.user1,
                show: false,
            });
        }
        return ret;
    }
    async findConvById(id) {
        return await this.convRepo.findOne({
            where: {
                id,
            },
            relations: ["user1", "user2", "messages", "messages.from"],
        });
    }
    async getConversation(me, to) {
        const conv = await this.convRepo.findOne({
            relations: {
                messages: {
                    from: true,
                },
                user1: true,
                user2: true,
            },
            where: [
                {
                    user1: {
                        id: me.id,
                    },
                    user2: {
                        id: to.id,
                    },
                },
                {
                    user1: {
                        id: to.id,
                    },
                    user2: {
                        id: me.id,
                    },
                },
            ],
        });
        if (!conv) {
            return null;
        }
        return conv;
    }
    async createConversation(me, to) {
        let conv = this.convRepo.create({
            user1: me,
            user2: to,
        });
        conv = await this.convRepo.save(conv);
        return conv;
    }
    async createDm(from, content) {
        const dm = this.dmRepo.create({ from, content });
        return await this.dmRepo.save(dm);
    }
    async pushDm(conversation, dm) {
        if (dm.from.id === conversation.user1.id)
            conversation.new2 = true;
        else
            conversation.new1 = true;
        conversation.messages.push(dm);
        return await this.convRepo.save(conversation);
    }
    async updateNewMessages(conv, userId) {
        if (userId === conv.user1.id)
            conv.new1 = false;
        else if (userId === conv.user2.id)
            conv.new2 = false;
        return await this.convRepo.save(conv);
    }
};
MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(database_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(database_1.ChanMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(database_1.DirectMessage)),
    __param(3, (0, typeorm_1.InjectRepository)(database_1.Conversation)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map