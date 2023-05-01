import { Channel, Restriction, User } from "src/database";
import { Repository } from "typeorm";
import { ChannelService } from "./channel.service";
export declare class RestrictionService {
    private restrictionRepo;
    private chanRepo;
    private readonly chanService;
    constructor(restrictionRepo: Repository<Restriction>, chanRepo: Repository<Channel>, chanService: ChannelService);
    isMuted(userId: number, channel: Channel): Promise<boolean>;
    isBanned(userId: number, channel: Channel): Promise<boolean>;
    getMutedId(userId: number, channel: Channel): Promise<number>;
    getBannedId(userId: number, channel: Channel): Promise<number>;
    getMuted(userId: number, channel: Channel): Promise<Restriction>;
    getBanned(userId: number, channel: Channel): Promise<Restriction>;
    ban(user: User, channel: Channel, date: Date): Promise<Channel>;
    mute(user: User, channel: Channel, date: Date): Promise<Channel>;
}
