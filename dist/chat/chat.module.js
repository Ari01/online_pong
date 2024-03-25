"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const database_1 = require("../database");
const game_module_1 = require("../game/game.module");
const room_service_1 = require("../game/room.service");
const notifs_service_1 = require("../users/notifs.service");
const users_module_1 = require("../users/users.module");
const chat_gateway_1 = require("./chat.gateway");
const chat_service_1 = require("./chat.service");
const channel_service_1 = require("./channel.service");
const chat_controller_1 = require("./chat.controller");
const message_service_1 = require("./message.service");
const restrictions_service_1 = require("./restrictions.service");
const game_service_1 = require("../game/game.service");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    (0, common_1.Module)({
        controllers: [chat_controller_1.ChatController],
        imports: [
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            game_module_1.GameModule,
            typeorm_1.TypeOrmModule.forFeature([
                database_1.Notif,
                database_1.Channel,
                database_1.User,
                database_1.ChanMessage,
                database_1.Restriction,
                database_1.DirectMessage,
                database_1.Conversation,
                database_1.Game,
            ]),
        ],
        providers: [
            chat_gateway_1.ChatGateway,
            chat_service_1.ChatService,
            notifs_service_1.NotifService,
            room_service_1.RoomService,
            channel_service_1.ChannelService,
            message_service_1.MessageService,
            restrictions_service_1.RestrictionService,
            game_service_1.GameService,
        ],
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map