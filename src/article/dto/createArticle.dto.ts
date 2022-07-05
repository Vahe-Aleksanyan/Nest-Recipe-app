import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  likesNum?: number;

  // @IsNumber()
  // @IsOptional()
  // userId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  categoryId: number;

  // @IsArray()
  // @IsOptional()
  // comments: [CreateCommentDto];
}
