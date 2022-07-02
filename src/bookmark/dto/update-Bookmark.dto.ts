import { IsNotEmpty, IsOptional, IsString } from "class-validator";
// the only difference is that everything is optional
export class UpdateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  link?: string;
}