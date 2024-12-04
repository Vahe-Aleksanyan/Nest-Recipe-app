import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/createComment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(userId: number, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        userId,
        ...dto,
      },
    });
    return comment;
  }

  async deleteCommentById(userId: number, commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment || comment.userId !== userId) {
      throw new ForbiddenException('Access resource denied');
    }
    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
