import { TwoFactorAuthenticationService } from "./2fa/2fa.service";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly twoFactorAuthenticationService;
    private readonly usersService;
    private readonly authService;
    constructor(twoFactorAuthenticationService: TwoFactorAuthenticationService, usersService: UsersService, authService: AuthService);
    login(): void;
    logout(req: any): void;
    redirect(req: any, res: any): any;
    devLogin(req: any, { username }: {
        username: any;
    }): unknown;
    register(res: any, req: any): unknown;
    turnOnTwoFactorAuthentication(req: any, { code }: {
        code: any;
    }): unknown;
    turnOffTwoFactorAuthentication(req: any): unknown;
    authenticate(req: any, { code }: {
        code: any;
    }): unknown;
}
