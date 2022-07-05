import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class sendRecoveryDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
