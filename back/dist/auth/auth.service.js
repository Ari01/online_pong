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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../database/entities/User");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, usersService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async createAdmin(username, password) {
        let user = this.userRepository.create({
            username: username,
            id42: 1,
            email: 'hidden',
            winratio: "no games played",
            profile_pic: '',
            elo: 0,
            n_win: 0,
            n_lose: 0,
            date_of_sign: new Date(),
        });
        if (user) {
            user.password = await bcrypt.hash(password, 10);
            user = await this.userRepository.save(user);
            return user;
        }
        console.log('error creating admin');
        return null;
    }
    async validateAdmin(username, password) {
        let user = await this.usersService.getByUsername(username);
        if (!user) {
            user = await this.createAdmin(username, password);
            return user;
        }
        else {
            const checkPassword = await bcrypt.compare(password, user.password);
            if (checkPassword)
                return user;
        }
        return null;
    }
    async createUser(details) {
        const user = {
            username: details.username,
            id42: details.id42,
            email: details.email,
            winratio: "no games played",
            profile_pic: details.img_url,
            elo: 0,
            n_win: 0,
            n_lose: 0,
            date_of_sign: new Date(),
        };
        return this.userRepository.create(user);
    }
    async validateUser(details) {
        const user = await this.userRepository.findOneBy({ id42: details.id42 });
        if (user) {
            return user;
        }
        const newUser = await this.createUser(details);
        return this.userRepository.save(newUser);
    }
    async findUser(id) {
        const user = await this.userRepository.findOneBy({ id: id });
        return user;
    }
    async getAuthenticatedUser(username) {
        const user = await this.userRepository.findOneBy({ username: username });
        if (!user) {
            const details = {
                username: username,
                email: `${username}@test.test`,
                id42: null,
                img_url: "none",
            };
            let newUser = await this.createUser(details);
            newUser.elo = 0;
            return this.userRepository.save(newUser);
        }
        return user;
    }
    getCookieWithJwtToken(userId) {
        const payload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: process.env.FT_SECRET,
            expiresIn: process.env.COOKIE_EXPIRATION_TIME,
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_EXPIRATION_TIME}`;
    }
    getCookieWithJwtAccessToken(userId, isSecondFactorAuthenticated = false) {
        const payload = {
            userId,
            isSecondFactorAuthenticated,
        };
        const token = this.jwtService.sign(payload, {
            secret: process.env.FT_SECRET,
            expiresIn: process.env.COOKIE_EXPIRATION_TIME,
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_EXPIRATION_TIME}`;
    }
    getLogoutCookie() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
    async getUserFromAuthenticationToken(token) {
        const payload = this.jwtService.verify(token, {
            secret: process.env.FT_SECRET,
        });
        if (payload.userId) {
            return this.usersService.getById(payload.userId);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map