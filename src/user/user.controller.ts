import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';


@UseGuards(JwtGuard) // 'jwt' are given name by default
@Controller('users')
export class UserController {
  // import user service threw dependency injection
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(
    @GetUser() user: User, // User comes from prisma client. guard finds the user and pass to GetUse r decorator which returns the data, in this case user object
    //@GetUser('email') email: string, // @getUser decorator is useful for this purpose
    //@GetUser('id') id: string,
  ) {
    return user;
  }

  // edit user will receive body with type of EditUserDto, also userId with the type of number
  @Patch()
  // @ApiResponse()
  editUser(@Body() dto: EditUserDto, @GetUser('id') userId: number) {
    return this.userService.editUser(userId, dto);
  }
}
