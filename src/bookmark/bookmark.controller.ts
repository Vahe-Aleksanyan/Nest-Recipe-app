import {
  Controller,
  Post,
  Get,
  UseGuards,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@UseGuards(JwtGuard) // for authentication
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookMarkService: BookmarkService) {}

  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookMarkService.createBookmark(userId, dto);
  }

  @Get()
  // it uses @getUser to get user id from the request from db by given id. we need this to check if we are dealing with right bookmark
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookMarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookMarkById(
    @GetUser('id') userid: number,
    @Param('id', ParseIntPipe) bookmarkId: number, // since params  bring string data use ParseIntPipe to make it number
  ) {
    return this.bookMarkService.getBookMarkById(userid, bookmarkId);
  }

  @Patch(':id')
  updateBookmarkById(
    @GetUser('id') userid: number,
    @Param('id', ParseIntPipe) bookMarkId: number,
    @Body() dto: UpdateBookmarkDto,
  ) {
    return this.bookMarkService.updateBookmarkById(userid, bookMarkId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userid: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookMarkService.deleteBookmarkById(userid, bookmarkId);
  }
}
