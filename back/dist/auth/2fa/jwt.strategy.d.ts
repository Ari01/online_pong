import { UsersService } from "src/users/users.service";
declare module "express" {
    interface Request {
        cookies: any;
    }
}
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(payload: any): unknown;
}
export {};
