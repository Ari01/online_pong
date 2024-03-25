/// <reference types="node" />
import { User } from "src/database";
export declare class QueueService {
    constructor();
    queue: User[];
    intervals: Map<number, NodeJS.Timer>;
    findOpponent(userId: number, elo: number, eloRange: number): User;
    checkQueued(index: number, userId: number): boolean;
    stopQueue(userId: number, index?: number): void;
    queueUp(user: User): number;
    addInterval(userId: number, intervalId: NodeJS.Timer): void;
    deleteInterval(userId: number): void;
}
