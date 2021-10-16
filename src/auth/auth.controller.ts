import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthLoginDto } from './dto/AuthLoginDto.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from 'src/decorators/userobj.decorator';
import { UserData } from 'src/user/userData.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  async phoneRegister(
    @Body() req: AuthLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    console.log('loguje');
    return this.authService.login(req, res);
  }

  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@UserObj() user: UserData, @Res() res: Response) {
    return this.authService.logout(user, res);
  }

}
