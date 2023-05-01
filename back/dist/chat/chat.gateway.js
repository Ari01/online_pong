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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const database_1 = require("../database");
const notifs_service_1 = require("../users/notifs.service");
const users_service_1 = require("../users/users.service");
const chat_service_1 = require("./chat.service");
const channel_service_1 = require("./channel.service");
const message_service_1 = require("./message.service");
const restrictions_service_1 = require("./restrictions.service");
const game_service_1 = require("../game/game.service");
let ChatGateway = class ChatGateway {
    constructor(usersService, chatService, notifService, channelService, messageService, restrictionService, gameService) {
        this.usersService = usersService;
        this.chatService = chatService;
        this.notifService = notifService;
        this.channelService = channelService;
        this.messageService = messageService;
        this.restrictionService = restrictionService;
        this.gameService = gameService;
    }
    handleConnection(client) { }
    handleDisconnect(client) { }
    async login(client, user) {
        const data = {
            user,
            status: "online",
        };
        console.log("chat ws login", user);
        if (this.gameService.getGameForUser(user.id))
            data.status = "ingame";
        this.chatService.addUser(user.id, client.id, data.status);
        client.broadcast.emit("updateStatus", data);
        this.server.to(client.id).emit("loggedIn", user);
    }
    async logout(client, user) {
        const data = {
            user,
            status: "offline",
        };
        console.log("chat ws logout");
        if (this.chatService.removeUser(user.id))
            client.broadcast.emit("updateStatus", data);
        else
            console.log("error logging out");
        this.server.to(client.id).emit("loggedOut");
    }
    async updateUser(client, user) {
        console.log("update user", user);
        const status = this.chatService.getUserStatus(user.id);
        client.broadcast.emit("updateStatus", { user, status });
        client.broadcast.emit("updateConvs", user);
        client.broadcast.emit("updateSelectedChan", user);
    }
    async updateUserStatus(client, data) {
        this.chatService.updateUserStatus(data.user.id, data.status);
        client.broadcast.emit("updateStatus", {
            user: data.user,
            status: data.status,
        });
    }
    async getFriends(client, user) {
        const friends = await this.usersService.getFriends(user);
        const map = new Map();
        friends.forEach((friend) => {
            const status = this.chatService.getUserStatus(friend.id);
            map.set(friend.id, status);
        });
        const ret = {
            friends: friends,
            statuses: JSON.stringify(Array.from(map)),
        };
        this.server.to(client.id).emit("friends", ret);
    }
    async notify(client, data) {
        console.log("chat websocket invite");
        if (data.from.id === data.to.id) {
            this.server.to(client.id).emit("error", "invalid target");
            return;
        }
        if (data.type === "Friend Request") {
            const friend = await this.usersService.findFriend(data.from.id, data.to.id);
            if (friend.length) {
                this.server
                    .to(client.id)
                    .emit("error", `friend ${data.to.username} already added`);
                return;
            }
        }
        const notif = await this.notifService.createNotif(data);
        console.log("notif", notif);
        if (notif) {
            const to = this.chatService.getUser(notif.to.id);
            console.log("to", to);
            if (to)
                this.server.to(to).emit("notified", notif);
        }
    }
    async addFriend(client, notif) {
        console.log("addFriend event");
        const newFriend = await this.usersService.addFriend(notif.from, notif.to);
        if (newFriend) {
            const toStatus = this.chatService.getUserStatus(notif.to.id);
            const fromStatus = this.chatService.getUserStatus(notif.from.id);
            const from = this.chatService.getUser(notif.from.id);
            if (from) {
                this.server
                    .to(from)
                    .emit("newFriend", { friend: notif.to, status: toStatus });
            }
            this.server
                .to(client.id)
                .emit("newFriend", { friend: notif.from, status: fromStatus });
        }
        else
            console.log("error adding friend");
        await this.notifService.deleteNotif(notif);
    }
    async deleteNotif(client, notif) {
        console.log("decline event");
        await this.notifService.deleteNotif(notif);
    }
    async deleteFriend(client, data) {
        console.log("deleteFriend event");
        const user1 = await this.usersService.deleteFriend(data.user, data.friend);
        const user2 = await this.usersService.deleteFriend(data.friend, data.user);
        if (user1 && user2) {
            const to = this.chatService.getUser(data.friend.id);
            if (to)
                this.server.to(to).emit("friendDeleted", data.user);
            this.server.to(client.id).emit("friendDeleted", data.friend);
        }
        else
            this.server.to(client.id).emit("error", "error deleting friend");
    }
    async acceptInvite(client, notif) {
        const from = this.chatService.getUser(notif.from.id);
        if (from) {
            this.server.to(from).emit("acceptedInvite", notif.from.id);
            this.server.to(client.id).emit("acceptedInvite", notif.from.id);
        }
        else
            this.server
                .to(client.id)
                .emit("error", "error: this invitation has expired");
        await this.notifService.deleteNotif(notif);
    }
    async getChannels(client, userId) {
        const privateChans = await this.channelService.getPrivateChannels(userId);
        const publicChans = await this.channelService.getPublicChannels();
        this.server.to(client.id).emit("channels", { privateChans, publicChans });
    }
    async createChannel(client, chanData) {
        console.log("create channel");
        const error = await this.channelService.checkChanData(chanData);
        if (error)
            this.server.to(client.id).emit("error", error);
        else {
            const channel = await this.channelService.createChannel(chanData);
            if (!channel)
                this.server.to(client.id).emit("error", "invalid chan name");
            else {
                if (channel.type !== "private")
                    this.server.emit("newChannel", channel);
                else
                    this.server.to(client.id).emit("newChannel", channel);
                client.join(channel.socketId);
            }
        }
    }
    async checkChanPassword(client, data) {
        const channel = await this.channelService.findChannelById(data.channel.id);
        if (!channel) {
            this.server.to(client.id).emit("error", "channel not found");
            return false;
        }
        if (channel.type === "protected") {
            let check = false;
            if (data.channel.password) {
                check = await this.channelService.checkChanPassword(data.channel.password, channel.password);
            }
            if (!check) {
                this.server.to(client.id).emit("wrongPassword");
                return false;
            }
        }
        return true;
    }
    async joinChannel(client, data) {
        let channel = await this.channelService.findChannelById(data.channel.id);
        if (await this.restrictionService.isBanned(data.user.id, channel)) {
            const ban = await this.restrictionService.getBanned(data.user.id, channel);
            this.server
                .to(client.id)
                .emit("error", `You cannot join this channel because you have been banned until ${ban.end}`);
            return;
        }
        if (!(await this.checkChanPassword(client, data)))
            return;
        if (!this.channelService.findUserInChan(data.user.id, channel)) {
            channel = await this.channelService.addUserChan(data.user, channel, "users");
            if (!channel.owner)
                channel = await this.channelService.setChanOwner(data.user, channel);
        }
        data.channel = Object.assign(Object.assign({}, channel), { password: null });
        client.join(data.channel.socketId);
        client.to(data.channel.socketId).emit("updateChannel", data.channel);
        this.server.to(client.id).emit("joinedChannel", data.channel);
        return data.channel;
    }
    async deleteChannel(client, data) {
        console.log("delete channel");
        const channel = await this.channelService.leaveChan(data.user, data.channel);
        if (!channel)
            this.server.emit("removeChannel", data.channel);
        else
            this.server.to(client.id).emit("removeChannel", data.channel);
        if (channel)
            this.server.to(data.channel.socketId).emit("leftChannel", channel);
        client.leave(data.channel.socketId);
    }
    async leaveChannel(client, data) {
        console.log("leave channel");
        const channel = await this.channelService.leaveChan(data.user, data.channel);
        if (!channel)
            this.server.to(data.channel.socketId).emit("removeChannel", data.channel);
        else
            this.server.to(channel.socketId).emit("leftChannel", channel);
        this.server.to(client.id).emit("leftChannel", channel);
        client.leave(data.channel.socketId);
    }
    async chanInvite(client, data) {
        console.log("chan invite");
        if (this.channelService.findUserInChan(data.to.id, data.channel)) {
            this.server.to(client.id).emit("error", "user already in chan");
            return;
        }
        const to = this.chatService.getUser(data.to.id);
        const notif = await this.notifService.createNotif(data);
        console.log("notif", notif);
        if (notif && to) {
            this.server.to(to).emit("notified", notif);
        }
    }
    async acceptChanInvite(client, notif) {
        await this.notifService.deleteNotif(notif);
        const channel = await this.joinChannel(client, {
            user: notif.to,
            channel: notif.channel,
        });
        if (channel)
            this.server.to(client.id).emit("newChannel", channel);
    }
    async message(client, data) {
        console.log("new message");
        const channel = await this.channelService.findChannelById(data.channel.id);
        if (!channel) {
            this.server.to(client.id).emit("error", "channel not found");
            return;
        }
        if (data.from &&
            (await this.restrictionService.isMuted(data.from.id, channel))) {
            const mute = await this.restrictionService.getMuted(data.from.id, channel);
            this.server
                .to(client.id)
                .emit("error", `You cannot write in this channel because you have been muted until ${mute.end}`);
            return;
        }
        console.log("creating msg");
        const message = await this.messageService.createChanMessage({
            content: data.content,
            from: data.from,
            channel,
        });
        console.log("returning new msg");
        if (!message)
            this.server.to(client.id).emit("error", "error creating message");
        else
            this.server.to(data.channel.socketId).emit("newMessage", message);
    }
    async setChannelPassword(client, data) {
        if (!this.checkChanPassword(client, data))
            return;
        const channel = await this.channelService.setChanPassword(data.channel, data.newPassword);
        if (data.channel.type === "public") {
            channel.password = null;
            this.server.emit("updateChannel", channel);
        }
    }
    async removeChannelPassword(client, channel) {
        if (!(await this.checkChanPassword(client, { channel })))
            return;
        channel = await this.channelService.findChannelById(channel.id);
        channel = await this.channelService.removeChanPassword(channel);
        this.server.emit("updateChannel", channel);
    }
    async banUser(client, data) {
        console.log("ban user event");
        let channel = await this.channelService.findChannelById(data.channel.id);
        if (!channel) {
            this.server.to(client.id).emit("error", "channel not found");
            return;
        }
        data.channel = await this.restrictionService.ban(data.user, channel, data.date);
        const to = this.chatService.getUser(data.user.id);
        if (to) {
            this.server.to(to).emit("banned", data);
        }
        this.message(client, {
            content: `${data.user.username} has been banned from the channel`,
            channel: data.channel,
        });
    }
    async muteUser(client, data) {
        console.log("mute user event");
        let channel = await this.channelService.findChannelById(data.channel.id);
        if (!channel) {
            this.server.to(client.id).emit("error", "channel not found");
            return;
        }
        data.channel = await this.restrictionService.mute(data.user, channel, data.date);
        const to = this.chatService.getUser(data.user.id);
        if (to) {
            this.server.to(to).emit("muted", data);
        }
        this.message(client, {
            content: `${data.user.username} has been muted`,
            channel: data.channel,
        });
    }
    async setAdmin(client, data) {
        console.log("setAdmin");
        let channel = await this.channelService.findChannelById(data.channel.id);
        if (!channel) {
            this.server.to(client.id).emit("error", "channel not found");
            return;
        }
        if (!this.channelService.findUserInChan(data.user.id, channel)) {
            this.server.to(client.id).emit("error", "user not found");
            return;
        }
        if (!channel.admins.find((admin) => admin.id === data.user.id)) {
            data.channel = await this.channelService.addUserChan(data.user, channel, "admins");
            const to = this.chatService.getUser(data.user.id);
            if (to)
                this.server.to(to).emit("setAsAdmin", data);
            this.message(client, {
                content: `${data.user.username} has been set as admin`,
                channel: data.channel,
            });
        }
        else
            this.server
                .to(client.id)
                .emit("error", `user ${data.user.username} is already an admin`);
    }
    async getConversation(client, data) {
        let conv = await this.messageService.getConversation(data.me, data.to);
        if (!conv) {
            conv = await this.messageService.createConversation(data.me, data.to);
            console.log("conv not found, creation new", conv);
        }
        else {
            conv = await this.messageService.updateNewMessages(conv, data.me.id);
            console.log("conv found", conv);
        }
        this.server.to(client.id).emit("openConversation", {
            id: conv.id,
            messages: conv.messages,
            to: data.to,
            show: true,
        });
    }
    async directMessage(client, data) {
        let conv = await this.messageService.findConvById(data.convId);
        if (!conv) {
            this.server.to(client.id).emit("error", "error: conversation not found");
            return;
        }
        const msg = await this.messageService.createDm(data.user, data.content);
        conv = await this.messageService.pushDm(conv, msg);
        if (!(await this.usersService.checkBlocked(data.to.id, data.user.id))) {
            console.log("not blocked, sending dm");
            const to = this.chatService.getUser(data.to.id);
            if (to) {
                conv = await this.messageService.updateNewMessages(conv, data.to.id);
                this.server.to(to).emit("newDm", conv);
            }
        }
        this.server.to(client.id).emit("newDm", conv);
    }
    async updateNewMessages(client, data) {
        const conv = await this.messageService.findConvById(data.convId);
        await this.messageService.updateNewMessages(conv, data.userId);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Namespace)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.User]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "login", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("logout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.User]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "logout", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("updateUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.User]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "updateUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("updateUserStatus"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "updateUserStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getFriends"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.User]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getFriends", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("notif"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "notify", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("acceptFriendRequest"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.Notif]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "addFriend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("deleteNotif"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.Notif]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "deleteNotif", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("deleteFriend"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "deleteFriend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("acceptGameInvite"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.Notif]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "acceptInvite", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getChannels"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getChannels", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("createChannel"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "createChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("joinChannel"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("deleteChannel"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "deleteChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leaveChannel"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "leaveChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("chanInvite"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "chanInvite", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("acceptChannelInvite"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.Notif]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "acceptChanInvite", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("chanMessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "message", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("setChannelPassword"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "setChannelPassword", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("removeChannelPassword"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.Channel]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "removeChannelPassword", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("banUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "banUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("muteUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "muteUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("setAdmin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "setAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getConversation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("directMessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "directMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("updateNewMessages"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "updateNewMessages", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3002, {
        cors: {
            origin: "http://192.168.233.232:3000",
        },
        namespace: "chat",
    }),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        chat_service_1.ChatService,
        notifs_service_1.NotifService,
        channel_service_1.ChannelService,
        message_service_1.MessageService,
        restrictions_service_1.RestrictionService,
        game_service_1.GameService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map