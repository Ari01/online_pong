import { Channel } from "./Channel";
import { User } from "./User";
export declare class ChanMessage {
    id: number;
    content: string;
    channel: Channel;
    from: User;
}
