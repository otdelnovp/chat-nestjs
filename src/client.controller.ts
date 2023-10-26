import { Controller, Get, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Пример клиентов')
@Controller('chat-client')
export class ClientController {
  @Get('restapi')
  @Render('chat-client-restapi')
  getRESTapiClient(): string {
    return;
  }

  // @Get('socket')
  // @Render('chat-client-socket')
  // getSocketClient(): string {
  //   return;
  // }
}
