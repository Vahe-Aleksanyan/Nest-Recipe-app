import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { createCommentDto } from '../../comment/dto/createComment.dto';
export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsNumber()
  @IsOptional()
  likesNum: number;

  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsArray()
  comments: [createCommentDto];
}
