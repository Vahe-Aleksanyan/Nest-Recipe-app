import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { comparePass, encodePassword } from '../utils/bcrypt';
import { PasswordNotMatchException } from '../auth/exceptions/passwordNotMatch';
import { sendRecoveryDto } from './dto/sendRecovery.dto';
import { UserNotFoundException } from './exceptions/userNotFound';
import { UnverifiedUserException } from './exceptions/unverifiedUser';
import { SendRecoveryEmail } from '../utils/sendRecoveryEmail';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { CodeNotMatchException } from './exceptions/codeNotMatch';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private sendMail: SendRecoveryEmail,
  ) {}

  async editUser(userId: number, dto: EditUserDto): Promise<User> {
    // console.log('here');
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.hash;
    return user;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    try {
      const userFromDb: User = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      const isOldPassCorrect: boolean = comparePass(
        dto.oldPassword,
        userFromDb.hash,
      );
      if (!isOldPassCorrect) {
        throw new PasswordNotMatchException();
      }
      const hash: string = encodePassword(dto.newpassword);

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hash,
        },
      });
      return { message: 'password updated successfully' };
    } catch (err) {
      return err.message;
    }
  }

  async sendRecovery(dto: sendRecoveryDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new UserNotFoundException();
      }

      if (!user.isVerified) {
        throw new UnverifiedUserException();
      }
      await this.sendMail.sendeMail(dto.email);
    } catch (err) {
      return err.message;
    }
  }

  async resetPassword(dto: ResetPasswordDto, code: string, email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new UserNotFoundException();
      }

      const verifCode = await this.prisma.verificationCode.findUnique({
        where: {
          email,
        },
      });

      const codeIsMatching = comparePass(code, verifCode.code);

      if (!codeIsMatching) {
        throw new CodeNotMatchException();
      }

      await this.prisma.verificationCode.delete({
        where: {
          email,
        },
      });

      const hashPass = encodePassword(dto.newPassword);

      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          hash: hashPass,
        },
      });
    } catch (err) {
      return err.message;
    }
  }
}
