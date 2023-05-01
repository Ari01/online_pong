import { Channel, Notif } from "src/database";
import { NotifData } from "src/utils/types";
import { Repository } from "typeorm";
import { UsersService } from "./users.service";
export declare class NotifService {
    private notifRepository;
    private readonly userService;
    constructor(notifRepository: Repository<Notif>, userService: UsersService);
    createNotif(data: NotifData): unknown;
    findChanInvite(data: NotifData): unknown;
    findNotif(data: NotifData): unknown;
    getNotifs(userId: number): unknown;
    getChanNotifs(channel: Channel): unknown;
    deleteNotif(notif: Notif): any;
}
