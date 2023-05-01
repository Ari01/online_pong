import { User } from "./User";
import { Conversation } from "./Conversation";
export declare class DirectMessage {
    id: number;
    content: string;
    from: User;
    conversation: Conversation;
}
