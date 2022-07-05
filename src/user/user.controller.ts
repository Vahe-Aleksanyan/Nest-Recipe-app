import { Body, Controller, Get, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { sendRecoveryDto } from './dto/sendRecovery.dto';

// @UseGuards(JwtGuard) // 'jwt' are given name by default
@Controller('users')
export class UserController {
  // import user service threw dependency injection
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(
    @GetUser() user: User, // User comes from prisma client. guard finds the user and pass to GetUse r decorator which returns the data, in this case user object
  ) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch()
  // @ApiResponse()
  editUser(@Body() dto: EditUserDto, @GetUser('id') userId: number) {
    return this.userService.editUser(userId, dto);
  }

  @UseGuards(JwtGuard)
  @Patch('changePassword')
  changePassword(
    @Body() dto: ChangePasswordDto,
    @GetUser('id') userId: number,
  ) {
    return this.userService.changePassword(userId, dto);
  }

  @Post('send-recovery')
  sendRecovery(@Body() dto: sendRecoveryDto) {
    return this.userService.sendRecovery(dto);
  }

  @Patch('resetPassword')
  resetPassword(
    @Body() dto: ResetPasswordDto,
    @Query() query: { code: string; email: string },
  ) {
    return this.userService.resetPassword(dto, query.code, query.email);
  }
}
