// instead writing AuthGuard('jwt') in user controller we export this class to write just JwtGuard
import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
