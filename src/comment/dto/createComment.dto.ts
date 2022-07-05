import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  articleId: number;

  // @IsNumber()
  // @IsNotEmpty()
  // userId: number;
}
