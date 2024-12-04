import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongCodeException extends HttpException {
  constructor() {
    super('Entered code is wrong', HttpStatus.FORBIDDEN);
  }
}
