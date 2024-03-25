import { Channel, Notif } from "src/database";
import { NotifData } from "src/utils/types";
import { Repository } from "typeorm";
import { UsersService } from "./users.service";
export declare class NotifService {
    private notifRepository;
    private readonly userService;
    constructor(notifRepository: Repository<Notif>, userService: UsersService);
    createNotif(data: NotifData): Promise<Notif>;
    findChanInvite(data: NotifData): Promise<Notif>;
    findNotif(data: NotifData): Promise<Notif>;
    getNotifs(userId: number): Promise<Notif[]>;
    getChanNotifs(channel: Channel): Promise<Notif[]>;
    deleteNotif(notif: Notif): Promise<void>;
}
