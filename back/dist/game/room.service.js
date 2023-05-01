"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const functions_1 = require("../utils/functions");
let RoomService = class RoomService {
    constructor() {
        this.rooms = new Map();
        this.usersRooms = new Map();
    }
    createRoomUser(user) {
        return {
            infos: user,
            ready: false,
        };
    }
    createRoom(host) {
        console.log("create room");
        let id = (0, functions_1.generateRandomId)(10);
        while (this.findRoom(id))
            id = (0, functions_1.generateRandomId)(10);
        const room = {
            id,
            host: this.createRoomUser(host),
            guest: null,
            spectators: [],
            gameStarted: false,
        };
        this.rooms.set(room.id, room);
        return room;
    }
    isEmptyRoom(room) {
        return !room.host && !room.guest && !room.spectators.length;
    }
    deleteRoom(roomId) {
        this.rooms.delete(roomId);
        return null;
    }
    addSpectator(user, room) {
        room.spectators.push(user);
        return room;
    }
    findRoom(id) {
        return this.rooms.get(id);
    }
    updateRoom(roomId, room) {
        this.rooms.set(roomId, room);
        this.usersRooms.set(room.host.infos.id, room);
        this.usersRooms.set(room.guest.infos.id, room);
        room.spectators.forEach((spectator) => {
            this.usersRooms.set(spectator.id, room);
        });
        return room;
    }
    getUserRoom(id) {
        return this.usersRooms.get(id);
    }
    setReady(roomId, userId) {
        const room = this.rooms.get(roomId);
        if (userId === room.host.infos.id) {
            room.host.ready = !room.host.ready;
            console.log("host ready");
        }
        else if (userId === room.guest.infos.id) {
            room.guest.ready = !room.guest.ready;
            console.log("guest ready");
        }
        this.rooms.set(room.id, room);
        return room;
    }
    joinRoom(user, room) {
        console.log("join room");
        if (!room.guest)
            room.guest = this.createRoomUser(user);
        else
            room.spectators.push(user);
        this.rooms.set(room.id, room);
        return room;
    }
    leaveRoom(id, userId) {
        let room = this.rooms.get(id);
        this.usersRooms.delete(userId);
        if (room !== undefined) {
            if (room.host && room.host.infos.id === userId) {
                console.log("host left");
                room.host = room.guest;
                room.guest = null;
            }
            else if (room.guest && room.guest.infos.id === userId) {
                console.log("guest left");
                room.guest = null;
            }
            else {
                console.log("spectator left");
                room.spectators = room.spectators.filter((spectator) => spectator.id !== userId);
            }
            if (this.isEmptyRoom(room)) {
                console.log("room empty, deleting room");
                return this.deleteRoom(id);
            }
            this.rooms.set(room.id, room);
            return room;
        }
        return null;
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)()
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map