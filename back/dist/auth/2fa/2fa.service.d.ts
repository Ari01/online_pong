import { User } from "src/database";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
export declare class TwoFactorAuthenticationService {
    private readonly usersService;
    private userRepo;
    constructor(usersService: UsersService, userRepo: Repository<User>);
    generateTwoFactorAuthenticationSecret(user: User): unknown;
    pipeQrCodeStream(stream: any, otpauthUrl: string): unknown;
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User): unknown;
}
