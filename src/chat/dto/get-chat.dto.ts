import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { chatDtoDocs } from '../chat.docs';

class GetChatUserDto {
  @ApiProperty(chatDtoDocs.userId)
  @Expose({ name: 'userId' })
  readonly Id: string;

  @ApiProperty(chatDtoDocs.authorName)
  @Expose({ name: 'user' })
  @Transform(user => user.value.name)
  readonly Name: string;

  @ApiProperty(chatDtoDocs.lastSeenAt)
  @Expose({ name: 'lastSeenAt' })
  readonly LastSeenAt: Date;
}

export class GetChatDto {
  @ApiProperty(chatDtoDocs.id)
  @Expose({ name: 'id' })
  readonly Id: string;

  @ApiProperty(chatDtoDocs.name)
  @Expose({ name: 'name' })
  readonly Name: string;

  @ApiProperty(chatDtoDocs.authorId)
  @Expose({ name: 'authorId' })
  readonly AuthorId: string;

  @ApiProperty(chatDtoDocs.authorName)
  @Expose({ name: 'author' })
  @Transform(author => author.value.name)
  readonly AuthorName: string;

  @ApiProperty(chatDtoDocs.parentId)
  @Expose({ name: 'parentId' })
  readonly ParentId?: string;

  @ApiProperty(chatDtoDocs.createdAt)
  @Expose({ name: 'createdAt' })
  readonly CreatedAt: Date;
  @ApiProperty(chatDtoDocs.updatedAt)
  @Expose({ name: 'updatedAt' })
  readonly UpdatedAt: Date;

  @ApiProperty(chatDtoDocs.unread)
  @Expose({ name: 'unread' })
  readonly Unread: boolean;

  @ApiProperty({ ...chatDtoDocs.users, type: GetChatUserDto, isArray: true })
  @Expose({ name: 'usersOnChat' })
  @Type(() => GetChatUserDto)
  readonly Users: GetChatUserDto[];
}
