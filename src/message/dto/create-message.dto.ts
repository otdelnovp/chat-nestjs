import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { messageDtoDocs } from '../message.docs';

export class CreateMessageDto {
  @ApiProperty(messageDtoDocs.content)
  @Expose({ name: 'Content' })
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty(messageDtoDocs.authorId)
  @Expose({ name: 'AuthorId' })
  @IsNotEmpty()
  readonly authorId?: string;

  @ApiProperty(messageDtoDocs.chatId)
  @Expose({ name: 'ChatId' })
  @IsNotEmpty()
  readonly chatId: string;
}
