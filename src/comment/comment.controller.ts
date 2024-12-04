import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentService } from './comment.service';

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post()
  createComment(@GetUser('id') userId: number, @Body() dto: CreateCommentDto) {
    return this.commentService.createComment(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCommentById(
    @GetUser('id') userid: number,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.deleteCommentById(userid, commentId);
  }
}
