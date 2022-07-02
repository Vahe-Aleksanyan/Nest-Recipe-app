import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
