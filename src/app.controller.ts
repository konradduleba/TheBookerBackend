import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/public/:id')
  @UseGuards(AuthGuard('jwt'))
  redirect(@Res() res, @Param('id') id) {
    return res.redirect(`/photo/${id}`);
  }
}
