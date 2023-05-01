import { Secret } from "./Secret";
export declare class User {
    id: number;
    username: string;
    email: string;
    isTwoFactorAuthenticationEnabled: boolean;
    id42?: number;
    winratio: string;
    profile_pic: string;
    avatar: string;
    elo: number;
    n_win: number;
    n_lose: number;
    date_of_sign: Date;
    blocked: number[];
    friends: User[];
    secret: Secret;
}
