import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        ...dto,
      },
    });
  }
  async deleteCategory(userId, categoryId) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!category || categoryId.userId !== userId) {
      throw new ForbiddenException('Access resource denied');
    }
    await this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
