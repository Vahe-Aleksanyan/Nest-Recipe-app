import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from "./dto";

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {
  }
  createArticle(dto: CreateArticleDto, authorId: number) {
    const article = this.prisma.article.create({
      data: {
        authorId,
        ...dto,
      },
    });
    return article;
  }

  getArticles(userId) {
    return this.prisma.article.findMany({
      where: {
        authorId: userId,
      },
    });
  }

  getArticleById(userId: number, articleId: number) {
    return this.prisma.article.findFirst({
      where: {
        id: articleId,
        authorId: userId,
      },
    });
  }

  async updateArticleById(
    userId: number,
    articleId: number,
    dto: UpdateArticleDto,
  ) {
    const article = await this.prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article || article.authorId !== userId) {
      throw new ForbiddenException('Access resource denied');
    }

    return this.prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteArticleById(userId: number, articleId: number) {
    const article = await this.prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });
    if (!article || article.authorId !== userId) {
      throw new ForbiddenException('Access resource denied');
    }
    await this.prisma.article.delete({
      where: {
        id: articleId,
      },
    });
  }
}
