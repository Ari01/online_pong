import { AuthService } from "src/auth/auth.service";
import { Socket } from "socket.io";
import { User } from "src/database";
export declare class ChatService {
    private readonly authService;
    constructor(authService: AuthService);
    users: Map<number, string>;
    statuses: Map<number, string>;
    addUser(id: number, socketId: string, status: string): void;
    removeUser(id: number): boolean;
    getUser(id: number): string;
    getUserStatus(id: number): string;
    updateUserStatus(id: number, status: string): void;
    getUserFromSocket(socket: Socket): Promise<User>;
}
