import { User } from "./User";
import { ChanMessage } from "./ChanMessage";
import { Restriction } from "./Restriction";
export declare class Channel {
    id: number;
    socketId: string;
    name: string;
    type: string;
    password?: string;
    owner: User;
    users: User[];
    admins: User[];
    banned: Restriction[];
    muted: Restriction[];
    messages: ChanMessage[];
}
