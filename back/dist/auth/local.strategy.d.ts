import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import { User } from "src/database";
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authenticationService;
    constructor(authenticationService: AuthService);
    validate(username: string, password: string): Promise<User>;
}
export {};
