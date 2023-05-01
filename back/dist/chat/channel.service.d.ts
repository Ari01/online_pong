import { ChanMessage, Channel, Restriction, User } from "src/database";
import { ChannelData } from "src/utils/types";
import { Repository } from "typeorm";
import { NotifService } from "src/users/notifs.service";
export declare class ChannelService {
    private chanRepo;
    private msgRepo;
    private userRepo;
    private restrictionRepo;
    private readonly notifService;
    constructor(chanRepo: Repository<Channel>, msgRepo: Repository<ChanMessage>, userRepo: Repository<User>, restrictionRepo: Repository<Restriction>, notifService: NotifService);
    findChannel(name: string, type: string): unknown;
    findChannelById(id: number): unknown;
    getChannelWithUsers(id: number): unknown;
    getPublicChannels(): unknown;
    getPrivateChannels(userId: number): unknown;
    getChannels(userId: number): unknown;
    checkChanData(chanData: ChannelData): unknown;
    checkChanPassword(pass: string, cryptedPass: string): unknown;
    setChanPassword(channel: Channel, pass: string): unknown;
    removeChanPassword(channel: Channel): unknown;
    setChanOwner(user: User, channel: Channel): unknown;
    addUserChan(user: User, chan: Channel, role: string): unknown;
    createChannel(chanData: ChannelData): unknown;
    findUserInChan(userId: number, channel: Channel): any;
    removeUserChan(user: User, chan: Channel): unknown;
    deleteChan(chan: Channel): any;
    leaveChan(user: User, chan: Channel): unknown;
}
