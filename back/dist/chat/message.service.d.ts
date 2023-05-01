import { ChanMessage, Conversation, DirectMessage, User } from "src/database";
import { Repository } from "typeorm";
export declare class MessageService {
    private userRepo;
    private msgRepo;
    private dmRepo;
    private convRepo;
    constructor(userRepo: Repository<User>, msgRepo: Repository<ChanMessage>, dmRepo: Repository<DirectMessage>, convRepo: Repository<Conversation>);
    findById(id: number): unknown;
    createChanMessage(data: any): unknown;
    getNewMessages(id: number): unknown;
    findConvById(id: number): unknown;
    getConversation(me: User, to: User): unknown;
    createConversation(me: User, to: User): unknown;
    createDm(from: User, content: string): unknown;
    pushDm(conversation: Conversation, dm: DirectMessage): unknown;
    updateNewMessages(conv: Conversation, userId: number): unknown;
}
