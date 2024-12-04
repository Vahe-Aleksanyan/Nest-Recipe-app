import { HttpException, HttpStatus } from '@nestjs/common';

export class CodeNotMatchException extends HttpException {
  constructor() {
    super('Wrong code, Cannot reset password', HttpStatus.FORBIDDEN);
  }
}
