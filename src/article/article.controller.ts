import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ArticleService } from './article.service';
import { GetUser } from '../auth/decorator';
import { CreateArticleDto } from './dto/createArticle.dto';
import { updateArticleDto } from './dto';

@UseGuards(JwtGuard) // for authorization
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  createArticle(@GetUser('id') userId: number, @Body() dto: CreateArticleDto) {
    return this.articleService.createArticle(dto, userId);
  }

  @Get()
  getArticles(@GetUser('id') userId: number) {
    return this.articleService.getArticles(userId);
  }

  @Get(':id')
  getArticleById(
    @GetUser('id') userid: number,
    @Param('id', ParseIntPipe) articleId: number, // since params  bring string data use ParseIntPipe to make it number
  ) {
    return this.articleService.getArticleById(userid, articleId);
  }

  @Patch(':id')
  updateArticleById(
    @GetUser('id') userid: number,
    @Param('id', ParseIntPipe) articleId: number,
    @Body() dto: updateArticleDto,
  ) {
    return this.articleService.updateArticleById(userid, articleId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteArticleById(
    @GetUser('id') userid: number,
    @Param('id', ParseIntPipe) articleId: number,
  ) {
    return this.articleService.deleteArticleById(userid, articleId);
  }
}
