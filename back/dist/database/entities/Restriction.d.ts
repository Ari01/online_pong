import { Channel } from "./Channel";
export declare class Restriction {
    id: number;
    userId: number;
    end: Date;
    banChannel: Channel;
    muteChannel: Channel;
}
