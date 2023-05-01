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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_1 = require("../database");
const typeorm_2 = require("typeorm");
const room_service_1 = require("./room.service");
let GameService = class GameService {
    constructor(gameRepo, userRepo, roomService) {
        this.gameRepo = gameRepo;
        this.userRepo = userRepo;
        this.roomService = roomService;
        this.users = new Map();
        this.games = new Map();
    }
    newPlayer(width, height, id) {
        const player = {
            x: id === 1 ? 30 : width - 50,
            y: height / 2 - 30,
            width: 20,
            height: 60,
            score: 0,
            win: false,
            paddle: null,
            infos: null,
        };
        player.paddle = {
            left: player.x,
            right: player.x + player.width,
            top: player.y + player.height,
            bottom: player.y,
            up: false,
            down: false,
        };
        return player;
    }
    newBall(width, height, dir) {
        const ball = {
            x: width / 2 - 5,
            y: height / 2 - 5,
            speedX: dir * 5,
            speedY: (Math.random() * 2 - 1) * 5,
            radius: 10,
        };
        return ball;
    }
    createGame(room, powerUps) {
        const width = 800;
        const height = 600;
        const gameId = room.id;
        const player1 = this.newPlayer(width, height, 1);
        player1.infos = room.host.infos;
        const player2 = this.newPlayer(width, height, 2);
        player2.infos = room.guest.infos;
        const ball = this.newBall(width, height, 1);
        const game = {
            width,
            height,
            player1,
            player2,
            ball,
            gameRunning: true,
            scoreUpdate: false,
            gameId,
            powerUps,
            grid: [],
        };
        this.saveGame(game);
        return game;
    }
    getGameForUser(id) {
        return this.users.get(id);
    }
    saveGame(game) {
        this.games.set(game.gameId, game);
        this.users.set(game.player1.infos.id, game);
        this.users.set(game.player2.infos.id, game);
    }
    deleteGame(game) {
        this.games.delete(game.gameId);
        this.users.delete(game.player1.infos.id);
        this.users.delete(game.player2.infos.id);
    }
    resetGame(game) {
        const user1 = game.player1.infos;
        const user2 = game.player2.infos;
        game.ball = this.newBall(game.width, game.height, 1);
        game.player1 = this.newPlayer(game.width, game.height, 1);
        game.player1.infos = user1;
        game.player2 = this.newPlayer(game.width, game.height, 2);
        game.player1.infos = user2;
        game.gameRunning = true;
        this.saveGame(game);
        return game;
    }
    getCurrentGames() {
        const games = [];
        const iter = this.games.values();
        while (iter) {
            const current = iter.next().value;
            if (!current)
                return games;
            games.push({
                id: current.gameId,
                player1: current.player1.infos,
                player2: current.player2.infos,
                score: `${current.player1.score}/${current.player2.score}`,
            });
        }
        return games;
    }
    async register(game) {
        const newGame = this.gameRepo.create({
            user1: game.player1.infos,
            user2: game.player2.infos,
            winnerId: game.player1.win
                ? game.player1.infos.id
                : game.player2.infos.id,
            score1: game.player1.score,
            score2: game.player2.score,
            date: new Date().toISOString().slice(0, 10),
        });
        return await this.gameRepo.save(newGame);
    }
    async updateUsersElo(gameInfos) {
        let winner, loser;
        if (gameInfos.user1.id === gameInfos.winnerId) {
            winner = gameInfos.user1;
            loser = gameInfos.user2;
        }
        else {
            winner = gameInfos.user2;
            loser = gameInfos.user1;
        }
        if (winner.elo > loser.elo) {
            winner.elo += 1;
            loser.elo -= 1;
        }
        else if (winner.elo === loser.elo) {
            winner.elo += 10;
            loser.elo -= 10;
        }
        else {
            winner.elo += 20;
            loser.elo -= 20;
        }
        winner.n_win++;
        loser.n_lose++;
        winner = await this.userRepo.save(winner);
        loser = await this.userRepo.save(loser);
        return { winner, loser };
    }
    async updateRoom(room, gameInfos) {
        const { winner, loser } = await this.updateUsersElo(gameInfos);
        if (winner.id === room.host.infos.id) {
            room.host.infos = winner;
            room.guest.infos = loser;
        }
        else {
            room.host.infos = loser;
            room.guest.infos = winner;
        }
        room.gameStarted = false;
        room.host.ready = false;
        room.guest.ready = false;
        this.roomService.updateRoom(room.id, room);
        return room;
    }
    startGame(game) {
        game.gameRunning = true;
    }
    stopGame(game) {
        game.gameRunning = false;
    }
    player1Collision(game) {
        if (game.ball.x <= game.player1.x + game.player1.width &&
            game.ball.x > game.player1.x &&
            game.ball.y >= game.player1.y &&
            game.ball.y <= game.player1.y + game.player1.height)
            return true;
        return false;
    }
    player2Collision(game) {
        if (game.ball.x + 10 >= game.player2.x &&
            game.ball.x < game.player2.x + game.player2.width &&
            game.ball.y > game.player2.y &&
            game.ball.y < game.player2.y + game.player2.height)
            return true;
        return false;
    }
    powerUpCollision(ball, pu) {
        if (ball.x >= pu.x &&
            ball.x <= pu.x + pu.size &&
            ball.y >= pu.y &&
            ball.y <= pu.y + pu.size)
            return true;
        return false;
    }
    movePaddle(game, playerId, direction) {
        if (playerId === 1) {
            if (direction === "ArrowUp") {
                if (game.player1.y > 0) {
                    game.player1.y -= 5;
                }
            }
            else if (direction === "ArrowDown") {
                if (game.player1.y + game.player1.height < game.height) {
                    game.player1.y += 5;
                }
            }
        }
        else if (playerId === 2) {
            if (direction === "ArrowUp") {
                if (game.player2.y > 0) {
                    game.player2.y -= 5;
                }
            }
            else if (direction === "ArrowDown") {
                if (game.player2.y + game.player2.height < game.height) {
                    game.player2.y += 5;
                }
            }
        }
        this.saveGame(game);
        return game;
    }
    updateBall(game) {
        game.ball.x += game.ball.speedX;
        game.ball.y += game.ball.speedY;
        if (game.ball.y < 0) {
            game.ball.speedY *= -1;
            game.ball.y = 0;
        }
        else if (game.ball.y + 10 > game.height) {
            game.ball.speedY *= -1;
            game.ball.y = game.height - game.ball.radius;
        }
        if (this.player1Collision(game)) {
            game.ball.speedX *= -1;
            game.ball.x += game.player1.width;
            if ((game.ball.speedY < 0 &&
                game.ball.y > game.player1.y + game.player1.height / 2) ||
                (game.ball.speedY > 0 &&
                    game.ball.y < game.player1.y + game.player1.height / 2))
                game.ball.speedY *= -1;
        }
        else if (this.player2Collision(game)) {
            game.ball.speedX *= -1;
            game.ball.x -= game.player2.width;
            if ((game.ball.speedY < 0 &&
                game.ball.y > game.player2.y + game.player2.height / 2) ||
                (game.ball.speedY > 0 &&
                    game.ball.y < game.player2.y + game.player2.height / 2))
                game.ball.speedY *= -1;
        }
        else {
            if (game.ball.x <= 0) {
                game.player2.score++;
                game.ball = this.newBall(game.width, game.height, -1);
                game.scoreUpdate = true;
            }
            else if (game.ball.x >= game.width) {
                game.player1.score++;
                game.ball = this.newBall(game.width, game.height, 1);
                game.scoreUpdate = true;
            }
        }
        return game;
    }
    updatePowerUp(game) {
        const index = game.grid.findIndex((pu) => this.powerUpCollision(game.ball, pu));
        if (index >= 0) {
            const powerUp = game.grid.splice(index, 1)[0];
            console.log(powerUp);
            if (!powerUp.type) {
                if (game.ball.speedX < 0)
                    game.player2.height += 10;
                else
                    game.player1.height += 10;
            }
            else {
                if (game.ball.speedX < 0)
                    game.player1.height -= 10;
                else
                    game.player2.height -= 10;
            }
        }
        return game;
    }
    spawnPowerUp(game) {
        if (Math.random() >= 0.999) {
            const x = Math.floor(Math.random() * 700) + 50;
            const y = Math.floor(Math.random() * 500) + 50;
            if (game.grid.find((pu) => pu.x === x && pu.y === y) ||
                (x > game.width / 2 - 10 && x < game.width / 2 + 25)) {
                return game;
            }
            game.grid.push({ x, y, type: Math.floor(Math.random() * 2), size: 20 });
        }
        return game;
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(database_1.Game)),
    __param(1, (0, typeorm_1.InjectRepository)(database_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, room_service_1.RoomService])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map