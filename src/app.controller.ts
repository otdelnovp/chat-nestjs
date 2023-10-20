import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('client')
  @Render('client')
  getClient(): string {
    return;
  }
}
