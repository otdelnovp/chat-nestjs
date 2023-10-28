import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { messageDtoDocs } from '../message.docs';

export class GetMessageDto {
  @ApiProperty(messageDtoDocs.id)
  @Expose({ name: 'id' })
  readonly Id: string;

  @ApiProperty(messageDtoDocs.content)
  @Expose({ name: 'content' })
  readonly Content: string;

  @ApiProperty(messageDtoDocs.authorId)
  @Expose({ name: 'authorId' })
  readonly AuthorId: string;

  @ApiProperty(messageDtoDocs.authorName)
  @Expose({ name: 'author' })
  @Transform(author => author.value.name)
  readonly AuthorName: string;

  @ApiProperty(messageDtoDocs.createdAt)
  @Expose({ name: 'createdAt' })
  readonly CreatedAt: Date;
  @ApiProperty(messageDtoDocs.updatedAt)
  @Expose({ name: 'updatedAt' })
  readonly UpdatedAt: Date;
}
