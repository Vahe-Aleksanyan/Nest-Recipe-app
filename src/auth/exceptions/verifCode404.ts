import { HttpException, HttpStatus } from '@nestjs/common';

export class VerifCode404Exception extends HttpException {
  constructor() {
    super(
      'Verification code not found in server: try again',
      HttpStatus.FORBIDDEN,
    );
  }
}
