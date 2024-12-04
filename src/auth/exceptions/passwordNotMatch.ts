import { HttpException, HttpStatus } from "@nestjs/common";

export class PasswordNotMatchException extends HttpException {
  constructor() {
    super(
      'Provided password is wrong',
      HttpStatus.FORBIDDEN,
    );
  }
}
