import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpCode, HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, UpdateBookmarkDto } from '../src/bookmark/dto';

// import transformer from '@nestjs/swagger/plugin';
// import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // same app module as we have in src
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    //what we have defined in  main.ts we need to define here
    app = moduleRef.createNestApplication();

    // include the pipes
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init(); // start the server


    // module.exports.name = 'nestjs-swagger-transformer';
    //
    // module.exports.version = 2;
    //
    // module.exports.factory = (cs) => {
    //   return transformer.before(
    //     {
    //       // @nestjs/swagger/plugin options (can be empty)
    //     },
    //     cs.program, // "cs.tsCompiler.program" for older versions of Jest (<= v27)
    //   );
    // };


    // const config = new DocumentBuilder()
    //   .setTitle('Bookmark App')
    //   .setDescription('The Bookmarks API, built with Nest js')
    //   .setVersion('1.0')
    //   .addTag('Bookmarks')
    //   .build();
    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('api', app, document);



    await app.listen(3001);
    prisma = app.get(PrismaService); // get prisma service and put in variable

    await prisma.cleanDb(); // we already defined docker that it cleans data

    pactum.request.setBaseUrl('http://localhost:3001');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vahe052001@mail.ru',
      password: 'password',
    };
    describe('SignUp', () => {
      it('throw an error if email is not provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('throw an error if password is not provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('throw an error if password is not provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });


    describe('SignIn', () => {
      it('throw an error if email is not provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('throw an error if password is not provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('throw an error if password is not provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
      });
    });
  });


  describe('User', () => {
    describe('Get me', () => {
      it('should return current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit User', () => {
      it('should return edit  user', () => {
        const dto: EditUserDto = {
          firstName: 'Vahe',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);

      });
    });
  });

  describe('Bookmarks', () => {

    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([])
      });
    });

    describe('Create Bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'https://www.youtube.com/',
      };
      it('should create a BookMark', () => {
        return pactum
          .spec()
          .post('/bookmarks/')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id')
      });
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1)
      });
    });

    describe('Get Bookmark by Id', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}') // we stored the id when creating the bookmark, see up
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit Bookmark by Id', () => {
      const dto: UpdateBookmarkDto = {
        title: 'bla bla blaa',
        description: 'bla bla bla ',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}') // we stored the id when creating the bookmark, see up
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
      });
    });


    describe('Delete Bookmark', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}') // we stored the id when creating the bookmark, see up
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204)
      });

      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
