import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { join } from 'path';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/public/:id')
  // @UseGuards(JwtAuthGuard)
  redirect(@Res() res, @Param('id') id) {
    return res.redirect(`/photo/${id}`);
    // return res.sendFile(join(process.cwd(), `src/public/images/${id}`))
  }
}
