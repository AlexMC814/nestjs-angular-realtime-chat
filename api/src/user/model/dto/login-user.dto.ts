import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
