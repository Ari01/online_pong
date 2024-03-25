import { PowerUp, Room } from "src/utils/types";
import { GameType } from "../utils/types";
import { Game, User } from "src/database";
import { Repository } from "typeorm";
import { RoomService } from "./room.service";
import { BallType } from "src/utils/types";
export declare class GameService {
    private gameRepo;
    private userRepo;
    private readonly roomService;
    constructor(gameRepo: Repository<Game>, userRepo: Repository<User>, roomService: RoomService);
    users: Map<number, GameType>;
    games: Map<string, GameType>;
    newPlayer(width: number, height: number, id: number): {
        x: number;
        y: number;
        width: number;
        height: number;
        score: number;
        win: boolean;
        paddle: any;
        infos: any;
    };
    newBall(width: number, height: number, dir: number): {
        x: number;
        y: number;
        speedX: number;
        speedY: number;
        radius: number;
    };
    createGame(room: Room, powerUps: boolean): GameType;
    getGameForUser(id: number): GameType;
    saveGame(game: GameType): void;
    deleteGame(game: GameType): void;
    resetGame(game: GameType): GameType;
    getCurrentGames(): any[];
    register(game: GameType): Promise<Game>;
    updateUsersElo(gameInfos: Game): Promise<{
        winner: any;
        loser: any;
    }>;
    updateRoom(room: Room, gameInfos: Game): Promise<Room>;
    startGame(game: GameType): void;
    stopGame(game: GameType): void;
    player1Collision(game: GameType): boolean;
    player2Collision(game: GameType): boolean;
    powerUpCollision(ball: BallType, pu: PowerUp): boolean;
    movePaddle(game: GameType, playerId: number, direction: string): GameType;
    updateBall(game: GameType): GameType;
    updatePowerUp(game: GameType): GameType;
    spawnPowerUp(game: GameType): GameType;
}
