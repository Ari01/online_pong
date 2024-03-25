import { Repository } from "typeorm";
import { Game, Secret, User } from "src/database";
export declare class UsersService {
    private usersRepository;
    private secretRepo;
    private gameRepo;
    constructor(usersRepository: Repository<User>, secretRepo: Repository<Secret>, gameRepo: Repository<Game>);
    getUserWithSecret(userId: number): Promise<User>;
    setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<User>;
    turnOnTwoFactorAuthentication(userId: number): Promise<import("typeorm").UpdateResult>;
    turnOffTwoFactorAuthentication(userId: number): Promise<boolean>;
    getById(userId: number): Promise<User>;
    getByUsername(userName: string): Promise<User>;
    addFriend(me: User, user: User): Promise<User | null>;
    getFriends(user: User): Promise<Array<User> | null>;
    findFriend(userId: number, friendId: number): Promise<any>;
    deleteFriend(user: User, toDel: User): Promise<User[]>;
    updateStatus(userId: number, newStatus: string): Promise<User>;
    updateUsername(userId: number, username: string): Promise<User>;
    updateUser(newUser: User): Promise<User>;
    uploadAvatar(userId: number, url: string): Promise<User>;
    block(myId: number, userId: number): Promise<User>;
    checkBlocked(myId: number, userId: number): Promise<boolean>;
    getGames(userId: number): Promise<Game[]>;
}
