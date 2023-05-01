import { ChannelService } from "./channel.service";
import { MessageService } from "./message.service";
export declare class ChatController {
    private readonly channelService;
    private readonly messageService;
    constructor(channelService: ChannelService, messageService: MessageService);
    getPrivateChannels(req: any): unknown;
    getPublicChannels(req: any): unknown;
    getNewMessages(req: any): unknown;
}
