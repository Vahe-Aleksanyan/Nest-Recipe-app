// for authentication
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) { // private means that we create variable inside this class
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // if it does not  reverie jwt token just throws an error
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: number; email: string }) {
    // the token will be translated and be put inside payload
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    delete user.hash; // don`t forget to delete password for security
    return user; // appends  payload object as user object of the request
  }
}
