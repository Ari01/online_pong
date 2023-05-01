import { UsersService } from "src/users/users.service";
declare module "express" {
    interface Request {
        cookies: any;
    }
}
declare const TwoFactorStrategy_base: any;
export declare class TwoFactorStrategy extends TwoFactorStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(payload: any): unknown;
}
export {};
