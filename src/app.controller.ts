import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('chat-client-restapi')
  @Render('chat-client-restapi')
  getRESTapiClient(): string {
    return;
  }

  @Get('chat-client-socket')
  @Render('chat-client-socket')
  getSocketClient(): string {
    return;
  }
}
