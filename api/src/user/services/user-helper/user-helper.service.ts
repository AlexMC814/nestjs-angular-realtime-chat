import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/model/dto/create-user.dto';
import { LoginUserDto } from 'src/user/model/dto/login-user.dto';
import { IUser } from 'src/user/model/user.interface';

@Injectable()
export class UserHelperService {
  createUserDtoToEntity(createUserDto: CreateUserDto): IUser {
    return {
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    };
  }

  loginUserDtoToEntity(loginUserDto: LoginUserDto): IUser {
    return {
      email: loginUserDto.email,
      password: loginUserDto.password,
    };
  }
}
