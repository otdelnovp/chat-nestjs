import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { chatDtoDocs } from '../chat.docs';

export class ToggleUserInChatDto {
  @ApiProperty(chatDtoDocs.userIdd)
  @Expose({ name: 'UserId' })
  @IsNotEmpty()
  readonly userId?: string;

  @ApiProperty(chatDtoDocs.chatId)
  @Expose({ name: 'ChatId' })
  @IsNotEmpty()
  readonly chatId?: string;
}
