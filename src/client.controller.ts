import { Controller, Get, Render } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Пример клиентов')
@Controller('client')
export class ClientController {
  @ApiOperation({ summary: 'Пример клиентского приложения по работе с чатами' })
  @Get('restapi')
  @Render('client-restapi')
  getRESTapiClient(): string {
    return;
  }

  // @Get('socket')
  // @Render('chat-client-socket')
  // getSocketClient(): string {
  //   return;
  // }
}
