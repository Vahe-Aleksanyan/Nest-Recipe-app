import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  content?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  imageUrl?: string;
}
