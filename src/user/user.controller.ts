import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { MyJwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
    @UseGuards(MyJwtGuard)
    @Get('me')
    me(@GetUser() user: User) {
        console.log(user)
        return user
    }
}
