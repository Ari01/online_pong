import { ChanMessage, Conversation, DirectMessage, User } from "src/database";
import { Repository } from "typeorm";
export declare class MessageService {
    private userRepo;
    private msgRepo;
    private dmRepo;
    private convRepo;
    constructor(userRepo: Repository<User>, msgRepo: Repository<ChanMessage>, dmRepo: Repository<DirectMessage>, convRepo: Repository<Conversation>);
    findById(id: number): Promise<ChanMessage>;
    createChanMessage(data: any): Promise<ChanMessage>;
    getNewMessages(id: number): Promise<any[]>;
    findConvById(id: number): Promise<Conversation>;
    getConversation(me: User, to: User): Promise<Conversation>;
    createConversation(me: User, to: User): Promise<Conversation>;
    createDm(from: User, content: string): Promise<DirectMessage>;
    pushDm(conversation: Conversation, dm: DirectMessage): Promise<Conversation>;
    updateNewMessages(conv: Conversation, userId: number): Promise<Conversation>;
}
