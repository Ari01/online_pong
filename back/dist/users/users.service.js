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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const database_1 = require("../database");
let UsersService = class UsersService {
    constructor(usersRepository, secretRepo, gameRepo) {
        this.usersRepository = usersRepository;
        this.secretRepo = secretRepo;
        this.gameRepo = gameRepo;
    }
    async getUserWithSecret(userId) {
        const userWithSecret = await this.usersRepository.findOne({
            relations: {
                secret: true,
            },
            where: {
                id: userId,
            },
        });
        return userWithSecret;
    }
    async setTwoFactorAuthenticationSecret(secret, userId) {
        let newSecret = this.secretRepo.create({
            key: secret,
        });
        newSecret = await this.secretRepo.save(newSecret);
        const userWithSecret = await this.getUserWithSecret(userId);
        userWithSecret.secret = newSecret;
        return await this.usersRepository.save(userWithSecret);
    }
    async turnOnTwoFactorAuthentication(userId) {
        return this.usersRepository.update(userId, {
            isTwoFactorAuthenticationEnabled: true,
        });
    }
    async turnOffTwoFactorAuthentication(userId) {
        let user = await this.usersRepository.findOneBy({ id: userId });
        if (!user)
            return false;
        user = await this.usersRepository.save(Object.assign(Object.assign({}, user), { isTwoFactorAuthenticationEnabled: false }));
        return user.isTwoFactorAuthenticationEnabled === false;
    }
    async getById(userId) {
        const user = await this.usersRepository.findOneBy({ id: userId });
        return user;
    }
    async getByUsername(userName) {
        if (!userName)
            return null;
        const user = await this.usersRepository.findOneBy({ username: userName });
        return user;
    }
    async addFriend(me, user) {
        console.log("addFriend");
        if (user && user.id !== me.id) {
            try {
                await this.usersRepository
                    .createQueryBuilder()
                    .relation(database_1.User, "friends")
                    .of(me)
                    .add(user);
            }
            catch (error) {
                console.log(`friend ${user.username} already added`);
                return null;
            }
            console.log("friend added");
            return user;
        }
        console.log(`could'nt add user ${user.username}`);
        return null;
    }
    async getFriends(user) {
        const users = await this.usersRepository.query(` SELECT * 
              FROM users U
              WHERE U.id <> $1
                AND EXISTS(
                  SELECT 1
                  FROM users_friends_users F
                  WHERE (F."usersId_1" = $1 AND F."usersId_2" = U.id )
                  OR (F."usersId_2" = $1 AND F."usersId_1" = U.id )
                  );  `, [user.id]);
        return users;
    }
    async findFriend(userId, friendId) {
        const friend = await this.usersRepository.query(` SELECT 1
                FROM users_friends_users
                WHERE ("usersId_1"=$1 AND "usersId_2"=$2)
                OR ("usersId_2"=$1 and "usersId_1"=$2);
            `, [userId, friendId]);
        return friend;
    }
    async deleteFriend(user, toDel) {
        await this.usersRepository
            .createQueryBuilder()
            .relation(database_1.User, "friends")
            .of(user)
            .remove(toDel);
        return this.getFriends(user);
    }
    async updateStatus(userId, newStatus) {
        const modifiedUser = await this.getById(userId);
        return modifiedUser;
    }
    async updateUsername(userId, username) {
        console.log("🚀 ~ file: users.service.ts:119 ~ UsersService ~ updateUsername ~ username", username);
        if (!username)
            return null;
        if (await this.getByUsername(username))
            return null;
        await this.usersRepository.update(userId, {
            username: username,
        });
        return await this.getById(userId);
    }
    async updateUser(newUser) {
        console.log("🚀 ~ file: users.service.ts:135 ~ UsersService ~ newUser.id", newUser);
        await this.usersRepository.update(newUser.id, newUser);
        return await this.getById(newUser.id);
    }
    async uploadAvatar(userId, url) {
        await this.usersRepository.update(userId, {
            avatar: url,
        });
        return await this.getById(userId);
    }
    async block(myId, userId) {
        const me = await this.getById(myId);
        const user = await this.getById(userId);
        if (me && user) {
            if (me.blocked && me.blocked.includes(userId)) {
                console.log('already blocked');
                return null;
            }
            if (!me.blocked) {
                console.log('blocked null, adding new', me.blocked);
                me.blocked = [userId];
                console.log('new blocked added', me.blocked);
            }
            else {
                console.log('blocking new');
                me.blocked.push(userId);
                console.log('new blocked added', me.blocked);
            }
            return await this.usersRepository.save(me);
        }
        console.log("me", me);
        return null;
    }
    async checkBlocked(myId, userId) {
        const me = await this.getById(myId);
        if (me && me.blocked && me.blocked.includes(userId)) {
            console.log("blocked");
            return true;
        }
        return false;
    }
    async getGames(userId) {
        const games = await this.gameRepo.find({
            relations: {
                user1: true,
                user2: true,
            },
            where: [
                {
                    user1: {
                        id: userId,
                    },
                },
                {
                    user2: {
                        id: userId,
                    },
                },
            ],
        });
        return games;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(database_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(database_1.Secret)),
    __param(2, (0, typeorm_1.InjectRepository)(database_1.Game)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map