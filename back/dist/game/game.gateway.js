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
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const database_1 = require("../database");
const game_service_1 = require("./game.service");
const room_service_1 = require("./room.service");
const queue_service_1 = require("./queue.service");
let GameGateway = class GameGateway {
    constructor(roomService, gameService, queueService) {
        this.roomService = roomService;
        this.gameService = gameService;
        this.queueService = queueService;
    }
    login(client, user) {
        this.getRoom(client, user);
    }
    logout(client, user) {
        let room = this.roomService.getUserRoom(user.id);
        if (room && !room.gameStarted) {
            const roomLeft = this.roomService.leaveRoom(room.id, user.id);
            client.to(room.id).emit("leftRoom", roomLeft);
            client.leave(room.id);
        }
        this.queueService.stopQueue(user.id);
    }
    getRoom(client, user) {
        let room = this.roomService.getUserRoom(user.id);
        if (!room) {
            room = this.roomService.createRoom(user);
            this.roomService.usersRooms.set(user.id, room);
        }
        client.join(room.id);
        this.server.to(client.id).emit("newRoom", room);
    }
    joinRoom(client, data) {
        console.log("join event");
        let room = this.roomService.getUserRoom(data.id);
        if (!room) {
            this.server.to(client.id).emit("error", "game room not found");
            return null;
        }
        const prevRoom = this.roomService.getUserRoom(data.user.id);
        if (prevRoom) {
            if (prevRoom.id !== room.id && !prevRoom.gameStarted)
                this.leaveRoom(client, { roomId: prevRoom.id, user: data.user });
            else
                return;
        }
        room = this.roomService.joinRoom(data.user, room);
        this.roomService.usersRooms.set(data.user.id, room);
        client.join(room.id);
        this.server.to(room.id).emit("joinedRoom", room);
    }
    join(client, roomId) {
        client.join(roomId);
    }
    leaveRoom(client, data) {
        console.log("leave room event");
        const room = this.roomService.leaveRoom(data.roomId, data.user.id);
        console.log(`client ${data.user.id} left room ${data.roomId}`);
        client.to(data.roomId).emit("leftRoom", room);
        client.leave(data.roomId);
        this.getRoom(client, data.user);
    }
    spectate(client, data) {
        console.log("spectatate event");
        let room = this.roomService.usersRooms.get(data.user.id);
        if (!room) {
            this.server
                .to(client.id)
                .emit("error", ` ${data.user.username} is not currently in a game`);
            return;
        }
        const prevRoom = this.roomService.getUserRoom(data.me.id);
        if (prevRoom) {
            if (this.gameService.getGameForUser(data.me.id) ||
                prevRoom.id === room.id)
                return;
            this.leaveRoom(client, { roomId: prevRoom.id, user: data.me });
        }
        room = this.roomService.addSpectator(data.me, room);
        this.roomService.rooms.set(room.id, room);
        this.roomService.usersRooms.set(data.me.id, room);
        client.join(room.id);
        this.server.to(room.id).emit("joinedRoom", room);
    }
    setReady(client, data) {
        console.log("setReady event");
        data.room = this.roomService.setReady(data.roomId, data.userId);
        this.server.to(data.roomId).emit("ready", data.room);
    }
    createGame(client, data) {
        console.log("create game event");
        const game = this.gameService.createGame(data.room, data.powerUps);
        data.room = this.roomService.updateRoom(data.room.id, Object.assign(Object.assign({}, data.room), { gameStarted: true }));
        this.server.emit("addGame", {
            id: game.gameId,
            player1: game.player1.infos,
            player2: game.player2.infos,
            score: "0/0",
        });
        this.server.to(data.room.id).emit("gameStarted", data.room);
        this.server.to(data.room.id).emit("updateStatus", "ingame");
        this.startGame(client, game);
    }
    getGame(client, userId) {
        const game = this.gameService.getGameForUser(userId);
        if (game)
            this.server.to(client.id).emit("newGame", game);
    }
    getCurrentGames(client, data) {
        const games = this.gameService.getCurrentGames();
        if (games)
            this.server.to(client.id).emit("newGames", games);
    }
    async endGame(game) {
        let room = this.roomService.findRoom(game.gameId);
        const gameInfos = await this.gameService.register(game);
        room = await this.gameService.updateRoom(room, gameInfos);
        this.server.to(room.id).emit("endGame", room);
        this.server.to(room.id).emit("updateStatus", "online");
        this.server
            .to(room.id)
            .emit("updateElo", { host: room.host.infos, guest: room.guest.infos });
        this.server.emit("deleteGame", game);
        this.gameService.deleteGame(game);
    }
    startGame(client, game) {
        const gameLoop = setInterval(() => {
            game = this.gameService.games.get(game.gameId);
            if (game.player1.score >= 10) {
                clearInterval(gameLoop);
                game.player1.win = true;
                game.gameRunning = false;
            }
            else if (game.player2.score >= 10) {
                clearInterval(gameLoop);
                game.player2.win = true;
                game.gameRunning = false;
            }
            else {
                game = this.gameService.updateBall(game);
                if (game.powerUps) {
                    game = this.gameService.spawnPowerUp(game);
                    game = this.gameService.updatePowerUp(game);
                }
                this.gameService.saveGame(game);
            }
            if (game.scoreUpdate) {
                game.scoreUpdate = false;
                this.server.emit("updateGames", game);
            }
            this.server.to(game.gameId).emit("updateGameState", game);
            if (!game.gameRunning) {
                this.endGame(game);
                return;
            }
        }, 1000 / 60);
        console.log("out game loop");
    }
    rematch(client, game) {
        game = this.gameService.resetGame(game);
        this.server.to(game.gameId).emit("gameReset", game);
        this.startGame(client, game);
    }
    movePaddle(client, data) {
        const game = this.gameService.movePaddle(data.game, data.playerId, data.direction);
        this.server.to(game.gameId).emit("updatePaddle", game);
    }
    stopPaddle(client, data) {
    }
    emitOpponent(client, user, opponent) {
        console.log("emit stop queue");
        const room = this.roomService.getUserRoom(opponent.id);
        this.server.to(room.id).emit("stopQueue");
        this.server.to(client.id).emit("stopQueue");
        if (!opponent) {
            console.log("opponent null, returning");
            return;
        }
        console.log(`user ${user.username} joining room ${room.id}`);
        this.joinRoom(client, { user, id: opponent.id });
    }
    searchOpponent(client, user) {
        console.log("search opponent event");
        let eloRange = 50;
        let n = 0;
        let opponent = this.queueService.findOpponent(user.id, user.elo, eloRange);
        if (opponent) {
            console.log(`opponent found ${opponent.username}`);
            this.emitOpponent(client, user, opponent);
            return;
        }
        console.log(`opponent not found, queueing user ${user.username}`);
        const index = this.queueService.queueUp(user);
        const interval = setInterval(() => {
            console.log(`interval userId: ${user.id}, id: ${interval}`);
            console.log(`loop counter : ${n}`);
            n++;
            eloRange += 50;
            if (!this.queueService.checkQueued(index, user.id)) {
                console.log(`user ${user.username} not queued, exiting`);
                return;
            }
            opponent = this.queueService.findOpponent(user.id, user.elo, eloRange);
            if (opponent) {
                console.log(`opponent found ${opponent.username}`);
                this.queueService.stopQueue(user.id, index);
                this.emitOpponent(client, user, opponent);
                return;
            }
        }, 10000);
        this.queueService.addInterval(user.id, interval);
        console.log("out interval");
    }
    stopQueue(client, user) {
        console.log("stopQueue");
        this.queueService.stopQueue(user.id);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Namespace)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.User]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "login", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("logout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.User]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "logout", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getRoom"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.User]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "getRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("joinRoom"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("join"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "join", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leaveRoom"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "leaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("spectate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "spectate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("setReady"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "setReady", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("createGame"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "createGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getGame"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "getGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getCurrentGames"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "getCurrentGames", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("startGame"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "startGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("rematch"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "rematch", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("movePaddle"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "movePaddle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("stopPaddle"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "stopPaddle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("searchOpponent"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.User]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "searchOpponent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("stopQueue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, database_1.User]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "stopQueue", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3003, {
        cors: {
            origin: "http://192.168.233.232:3000",
        },
        namespace: "game",
    }),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        game_service_1.GameService,
        queue_service_1.QueueService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map