import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { messageDtoDocs } from '../message.docs';

export class SeenMessageDto {
  @ApiProperty(messageDtoDocs.chatId)
  @Expose({ name: 'ChatId' })
  @IsNotEmpty()
  readonly chatId: string;

  @ApiProperty(messageDtoDocs.userId)
  @Expose({ name: 'UserId' })
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty(messageDtoDocs.lastSeenAt)
  @Expose({ name: 'LastSeenAt' })
  @IsNotEmpty()
  readonly lastSeenAt: Date;
}
