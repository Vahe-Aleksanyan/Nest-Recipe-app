import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { encodePassword } from './bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

export class SendRecoveryEmail {
  constructor(
    private readonly mailerService: MailerService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async sendeMail(email: string) {
    const code = uuidv4();
    const CLIENT_URL = this.config.get('CLIENT_URL');
    const hashedCode = encodePassword(code);

    await this.prisma.verificationCode.create({
      data: {
        code: hashedCode,
        email,
      },
    });

    const link = `https://${CLIENT_URL}/reset-password/${email}/${code}`;
    const mailSubject = 'Reset Password';
    const mailHTML = `
        <h1> Reset Password </h1>
        <p> Click <a href="${link}"> here </a> to reset your password.</p>
    `;

    this.mailerService
      .sendMail({
        to: email, // list of receivers
        from: 'vahe052001@mail.ru', // sender address
        subject: mailSubject,
        html: mailHTML,
      })
      .then(() => {
        console.log('sent email successfully');
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
}
