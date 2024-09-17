import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/model/user.entity';
import { IUser } from 'src/user/model/user.interface';
import { Like, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { from } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  private async emailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return true;
    }

    return false;
  }

  private hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }

  private async findUser(id: number): Promise<IUser> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async findByEmail(email: string): Promise<IUser> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });
  }

  async create(newUser: IUser): Promise<IUser> {
    try {
      const exists: boolean = await this.emailExists(newUser.email);

      if (!exists) {
        const passwordHash: string = await this.hashPassword(newUser.password);
        newUser.password = passwordHash;
        const user = await this.userRepository.save(
          this.userRepository.create(newUser),
        );
        return this.getOne(user.id);
      }

      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    } catch {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<IUser>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  async findAllByUsername(username: string): Promise<IUser[]> {
    return this.userRepository.find({
      where: {
        username: Like(`%${username.toLowerCase()}%`),
      },
    });
  }

  getOne(id: number): Promise<IUser> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  async login(user: IUser): Promise<string> {
    try {
      const foundUser = await this.findByEmail(user.email.toLowerCase());

      if (foundUser) {
        const matches: boolean = await this.validatePassword(
          user.password,
          foundUser.password,
        );

        if (matches) {
          const payload: IUser = await this.findUser(foundUser.id);
          return this.authService.generateJwt(payload);
        }

        throw new HttpException(
          'Login was not successful, wrong credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        'Login was not successful, wrong credentials',
        HttpStatus.UNAUTHORIZED,
      );
    } catch {
      throw new HttpException(
        'Login was not successful, wrong credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  updateUser(id: number, user: IUser) {
    return from(this.userRepository.update(id, user));
  }
}
