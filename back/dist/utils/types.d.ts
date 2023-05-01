import { Channel } from "src/database";
import { User } from "src/database/entities/User";
export declare type Done = (err: Error, user: User) => void;
export declare type UserDetails = {
    username: string;
    email: string;
    id42: number;
    img_url: string;
};
export declare type NotifData = {
    type: string;
    from: User;
    to: User;
    acceptEvent: string;
    channel?: Channel;
};
export declare type ChannelData = {
    name: string;
    type: string;
    password?: string;
    owner: User;
};
export declare type MessageData = {
    content: string;
    from?: User;
    channel: any;
};
export declare type RoomUser = {
    infos: User;
    ready: boolean;
};
export declare type Room = {
    id: string;
    host: RoomUser;
    guest: RoomUser;
    spectators: Array<User>;
    gameStarted: boolean;
};
export declare type GameInfos = {
    id: string;
    player1: User;
    player2: User;
    score: string;
};
export declare type PowerUp = {
    x: number;
    y: number;
    type: number;
    size: number;
};
export declare type GameType = {
    width: number;
    height: number;
    player1: PlayerType;
    player2: PlayerType;
    ball: BallType;
    gameRunning: boolean;
    scoreUpdate: boolean;
    powerUps: boolean;
    grid: PowerUp[];
    gameId: any;
};
export declare type PlayerType = {
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
    win: boolean;
    paddle: PaddleType;
    infos: User;
};
export declare type BallType = {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    radius: number;
};
export declare type PaddleType = {
    top: number;
    bottom: number;
    left: number;
    right: number;
    up: boolean;
    down: boolean;
};
