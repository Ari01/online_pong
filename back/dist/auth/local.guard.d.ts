import { ExecutionContext } from "@nestjs/common";
declare const LocalAuthenticationGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class LocalAuthenticationGuard extends LocalAuthenticationGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
