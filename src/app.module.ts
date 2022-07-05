import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { CategoryModule } from './category/category.module';

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
    MailerModule.forRoot({ // for sending emails
      transport: {
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
          user: 'vahe052001@mail.ru',
          pass: 'Fpcwyzzm6uu4KeVbdj39',
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      },
    }),
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
