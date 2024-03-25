import { User } from "./User";
import { DirectMessage } from "./DirectMessages";
export declare class Conversation {
    id: number;
    new1: boolean;
    new2: boolean;
    user1: User;
    user2: User;
    messages: DirectMessage[];
}
