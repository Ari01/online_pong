/// <reference types="multer" />
import { User } from "src/database";
import { Repository } from "typeorm";
import { UsersService } from "./users.service";
import { NotifService } from "./notifs.service";
export declare class UsersController {
    private readonly userRepository;
    private readonly usersService;
    private readonly notifService;
    constructor(userRepository: Repository<User>, usersService: UsersService, notifService: NotifService);
    findMe(req: any): Promise<User | null>;
    findOneById(params: {
        id: string;
    }): Promise<User | null>;
    findOneByUsername(params: any): Promise<User | null>;
    addFriend(req: any, { username }: {
        username: any;
    }): Promise<User>;
    getFriends(req: any): Promise<User[]>;
    deleteFriend(req: any, { userId }: {
        userId: any;
    }): Promise<User[]>;
    getNotifs(req: any): Promise<import("src/database").Notif[]>;
    updateUser(req: any): Promise<User>;
    updateUsername(req: any): Promise<User>;
    uploadAvatar(req: any, file: Express.Multer.File): Promise<User>;
    getAvatar(req: any, res: any): any;
    getAvatarById(params: any, res: any): Promise<any>;
    blockUser(req: any, { userId }: {
        userId: any;
    }): Promise<User>;
    getGames(params: any): Promise<import("src/database").Game[]>;
}
