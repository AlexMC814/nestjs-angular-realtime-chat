import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user-service/user.service';
import { IUser } from '../model/user.interface';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserHelperService } from '../services/user-helper/user-helper.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { ILoginResponse } from '../model/login-response.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { map, Observable, of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

const storage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    const userEntity =
      this.userHelperService.createUserDtoToEntity(createUserDto);
    return this.userService.create(userEntity);
  }

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.getAll({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Get('find-by-username')
  async findAllByUsername(@Query('username') username: string) {
    return this.userService.findAllByUsername(username);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    const userEntity: IUser =
      this.userHelperService.loginUserDtoToEntity(loginUserDto);
    const jwt: string = await this.userService.login(userEntity);
    return {
      access_token: jwt,
      token_type: 'JWT',
      expires_in: 10000,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<any> {
    const user: IUser = req.user;
    console.info('USER', user);
    return this.userService
      .updateUser(user.id, {
        profileImage: file.filename,
      })
      .pipe(map((user: IUser) => ({ profileImage: user.profileImage })));
    return of({ imagePath: file.filename });
  }
}
