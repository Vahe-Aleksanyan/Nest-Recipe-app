import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SendRecoveryEmail } from '../utils/sendRecoveryEmail';

@Module({
  controllers: [UserController],
  providers: [UserService, SendRecoveryEmail],
  imports: [SendRecoveryEmail],
})
export class UserModule {}
