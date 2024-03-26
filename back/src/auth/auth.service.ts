import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/database/entities/User";
import { UserDetails } from "src/utils/types";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }

  async createAdmin(username: string, password: string) {
    console.log('creating admin')
    let user = this.userRepository.create({
      username: username,
      id42: 1,
      email: 'hidden',
      winratio: "no games played",
      profile_pic: '',
      elo: 0,
      n_win: 0,
      n_lose: 0,
      date_of_sign: new Date(),
    })

    if (user) {
      console.log('user created, encrypting pass')
      user.password = await bcrypt.hash(password, 10)
      console.log('pass encrypted, saving user')
      user = await this.userRepository.save(user)
      console.log('user saved, returning new user')
      return user;
    }
    console.log('error creating admin')
    return null;
  }

  async validateAdmin(username: string, password: string) {
    console.log('validate admin')
    let user = await this.usersService.getByUsername(username);

    if (!user) {
      console.log('user not found, creating new one')
      user = await this.createAdmin(username, password)
      console.log('returned user')
      console.log(user)
      return user;
    } else {
      console.log('user found, comparing passwords')
      const checkPassword = await bcrypt.compare(password, user.password)
      if (checkPassword) {
        console.log('password ok')
        return user;
      }
    }
    console.log('error authenticating user')
    return null;
  }

  async createUser(details: UserDetails) {
    const user = {
      username: details.username,
      id42: details.id42,
      email: details.email,
      winratio: "no games played",
      profile_pic: details.img_url,
      elo: 0,
      n_win: 0,
      n_lose: 0,
      date_of_sign: new Date(),
    };

    return this.userRepository.create(user);
  }

  async validateUser(details: UserDetails) {
    //console.log(details.id42);
    const user = await this.userRepository.findOneBy({ id42: details.id42 });

    //console.log(user);
    if (user) {
      return user;
    }
    const newUser = await this.createUser(details);
    /*console.log('user not found. Creating...')
    console.log('newUser', newUser);*/
    return this.userRepository.save(newUser);
  }

  async findUser(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    /*console.log('foundUser in db');
    console.log(user ? 'found' : 'not found');
    console.log('user');
    console.log(user);*/

    return user;
  }

  async getAuthenticatedUser(username: string) {
    const user = await this.userRepository.findOneBy({ username: username });

    if (!user) {
      const details: UserDetails = {
        username: username,
        email: `${username}@test.test`,
        id42: null,
        img_url: "none",
      };
      let newUser = await this.createUser(details);
      newUser.elo = 0;
      return this.userRepository.save(newUser);
    }
    return user;
  }

  // 42 cookie token
  getCookieWithJwtToken(userId: number) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.FT_SECRET,
      expiresIn: process.env.COOKIE_EXPIRATION_TIME,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_EXPIRATION_TIME}`;
  }

  // 2fa cookie token
  getCookieWithJwtAccessToken(
    userId: number,
    isSecondFactorAuthenticated = false
  ) {
    const payload = {
      userId,
      isSecondFactorAuthenticated,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.FT_SECRET,
      expiresIn: process.env.COOKIE_EXPIRATION_TIME,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_EXPIRATION_TIME}`;
  }

  // logout cookie
  getLogoutCookie() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  async getUserFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.FT_SECRET,
    });

    if (payload.userId) {
      return this.usersService.getById(payload.userId);
    }
  }
}
