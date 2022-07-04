import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';
import { ControllerService } from './controller/controller.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    ArticleModule,
    CommentModule,
  ],
  controllers: [],
  providers: [ControllerService],
})
export class AppModule {}
