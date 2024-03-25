import { User } from "./User";
import { Channel } from "./Channel";
export declare class Notif {
    id: number;
    type: string;
    acceptEvent: string;
    from: User;
    to: User;
    channel: Channel;
}
