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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
let QueueService = class QueueService {
    constructor() {
        this.queue = [];
        this.intervals = new Map();
    }
    findOpponent(userId, elo, eloRange) {
        const maxElo = elo + eloRange;
        const index = this.queue.findIndex((user) => userId !== user.id && user.elo >= elo - 100 && user.elo <= maxElo);
        console.log("find opponent");
        console.log(`user elo = ${elo}`);
        console.log(`max elo search = ${maxElo}`);
        if (index >= 0) {
            console.log(`opponent elo found = ${this.queue[index].elo}`);
            console.log(`removing opponent ${this.queue[index].username} from queue`);
            const opponent = this.queue[index];
            this.stopQueue(opponent.id, index);
            return opponent;
        }
        return null;
    }
    checkQueued(index, userId) {
        return this.queue[index] && this.queue[index].id === userId;
    }
    stopQueue(userId, index) {
        if (index === undefined) {
            console.log("index undefined");
            index = this.queue.findIndex((user) => user.id === userId);
            if (index >= 0) {
                console.log("index found", index);
                this.queue.splice(index, 1);
            }
        }
        else if (this.checkQueued(index, userId)) {
            this.queue.splice(index, 1);
        }
        this.deleteInterval(userId);
    }
    queueUp(user) {
        return this.queue.push(user) - 1;
    }
    addInterval(userId, intervalId) {
        this.deleteInterval(userId);
        this.intervals.set(userId, intervalId);
    }
    deleteInterval(userId) {
        console.log('delete interval enter');
        console.log(`get interval ${userId} : ${this.intervals.get(userId)}`);
        if (this.intervals.has(userId)) {
            const intervalId = this.intervals.get(userId);
            console.log(`delete interval ${intervalId}`);
            clearInterval(intervalId);
            const del = this.intervals.delete(userId);
            console.log(`deleted ? ${del}`);
        }
    }
};
QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QueueService);
exports.QueueService = QueueService;
//# sourceMappingURL=queue.service.js.map