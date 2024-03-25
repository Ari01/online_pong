import { Channel } from "src/database";
import { ChannelService } from "./channel.service";
import { MessageService } from "./message.service";
export declare class ChatController {
    private readonly channelService;
    private readonly messageService;
    constructor(channelService: ChannelService, messageService: MessageService);
    getPrivateChannels(req: any): Promise<{
        password: any;
        id: number;
        socketId: string;
        name: string;
        type: string;
        owner: import("src/database").User;
        users: import("src/database").User[];
        admins: import("src/database").User[];
        banned: import("src/database").Restriction[];
        muted: import("src/database").Restriction[];
        messages: import("src/database").ChanMessage[];
    }[]>;
    getPublicChannels(req: any): Promise<Channel[]>;
    getNewMessages(req: any): Promise<any[]>;
}
