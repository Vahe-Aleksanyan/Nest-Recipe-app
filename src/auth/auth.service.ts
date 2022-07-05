import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { encodePassword, comparePass } from '../utils/bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifCode404Exception } from './exceptions/verifCode404';
import { WrongCodeException } from './exceptions/wrongCode';

// uses injectable dependency. with constructor, we use Prisma model
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
  async signup(dto: AuthDto) {
    // Auth Dto is for validation

    // generate new password
    const hash = encodePassword(dto.password);

    try {
      // save new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // generate verif code
      const code = String(Math.floor(Math.random() * 1000000));
      const hashedCode = encodePassword(code);
      // save code in db
      await this.prisma.verificationCode.create({
        data: {
          email: dto.email,
          code: hashedCode,
        },
      });
      // sending verify email with corresponding message/code
      this.mailerService
        .sendMail({
          to: dto.email, // list of receivers
          from: 'vahe052001@mail.ru', // sender address
          subject: 'Testing Nest MailerModule ✔', // Subject line
          text: 'welcome', // plaintext body
          html: `
      <h1>Read - Verify your account</h1>
      <p>Your verification code is: <strong>${code}</strong></p>
         `, // HTML body content
        })
        .then(() => {
          console.log('sent email successfully');
        })
        .catch((err) => {
          console.log(err.message);
        });

      // finally return signed token, but maybe not need really this
      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          console.log(err.message);
          throw new ForbiddenException('credentials are taken');
        }
      }
    }
  }

  async verifyUser(email: string, code: string) {
    const codeInDb = await this.prisma.verificationCode.findUnique({
      where: {
        email: email, // check
      },
    });

    console.log(codeInDb.code);
    if (!codeInDb) {
      throw new VerifCode404Exception();
    }

    const codeIsCorrect = comparePass(code, codeInDb.code);

    if (!codeIsCorrect) {
      throw new WrongCodeException();
    }

    // we don't need the code anymore in db
    await this.prisma.verificationCode.delete({
      where: {
        email: email,
      },
    });

    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    });
    return { message: 'successfully verified user' };
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Incorrect email address');
    }
    const passwordIsCorrect = comparePass(dto.password, user.hash);
    if (!passwordIsCorrect) {
      throw new ForbiddenException('Incorrect Password');
    }
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '6h',
      secret,
    });
    return {
      access_token: token,
    };
  }
}
