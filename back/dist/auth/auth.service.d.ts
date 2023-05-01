import { Repository } from "typeorm";
import { User } from "src/database/entities/User";
import { UserDetails } from "src/utils/types";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly usersService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, usersService: UsersService);
    createUser(details: UserDetails): unknown;
    validateUser(details: UserDetails): unknown;
    findUser(id: number): unknown;
    getAuthenticatedUser(username: string): unknown;
    getCookieWithJwtToken(userId: number): string;
    getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated?: boolean): string;
    getLogoutCookie(): string;
    getUserFromAuthenticationToken(token: string): unknown;
}
