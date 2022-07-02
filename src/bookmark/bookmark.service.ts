import { Delete, ForbiddenException, Get, Injectable, Patch, Post } from "@nestjs/common";
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { addWaitHandler } from "pactum/src/exports/handler";

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {
  }
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookMark = await this.prisma.bookMark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookMark;
  }

  getBookmarks(userId: number) {
    return this.prisma.bookMark.findMany({
      where: {
        userId: userId, // returns all the bookmarks corresponding to the logged-in user
      },
    });
  }

  getBookMarkById(userId: number, bookMarkId: number) {
    return this.prisma.bookMark.findFirst({
      where: {
        id: bookMarkId,
        userId: userId, // returns all the bookmarks corresponding to the logged-in user
      },
    });
  }

  async updateBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: UpdateBookmarkDto,
  ) {console.log("jjfjfjkjdnksjabnknfkdnaskBfkasbfhjasbjhlabfhjkabhjkabjkawbkhjerwfb ");
    const bookmark = await this.prisma.bookMark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access resource denied');
    }

    return this.prisma.bookMark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });

  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookMark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access resource denied');
    }
    await this.prisma.bookMark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
