import { User } from "src/database";
import { Room, RoomUser } from "src/utils/types";
export declare class RoomService {
    rooms: Map<string, Room>;
    usersRooms: Map<number, Room>;
    createRoomUser(user: User): RoomUser;
    createRoom(host: User): {
        id: string;
        host: RoomUser;
        guest: any;
        spectators: any[];
        gameStarted: boolean;
    };
    isEmptyRoom(room: Room): boolean;
    deleteRoom(roomId: string): any;
    addSpectator(user: User, room: Room): Room;
    findRoom(id: string): Room;
    updateRoom(roomId: string, room: Room): Room;
    getUserRoom(id: number): Room;
    setReady(roomId: string, userId: number): Room;
    joinRoom(user: User, room: Room): Room;
    leaveRoom(id: string, userId: number): any;
}
