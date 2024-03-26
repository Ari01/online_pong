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
    redirect(req: any, res: any): Promise<void>;
    devLogin(req: any, { username, password }: {
        username: any;
        password: any;
    }): Promise<any>;
    register(res: any, req: any): Promise<void>;
    turnOnTwoFactorAuthentication(req: any, { code }: {
        code: any;
    }): Promise<boolean>;
    turnOffTwoFactorAuthentication(req: any): Promise<boolean>;
    authenticate(req: any, { code }: {
        code: any;
    }): Promise<any>;
}
