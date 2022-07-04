import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  articleId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
