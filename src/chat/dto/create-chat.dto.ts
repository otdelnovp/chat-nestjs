import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { chatDtoDocs } from '../chat.docs';

class CreateChatUserDto {
  @ApiProperty(chatDtoDocs.userId)
  @Expose({ name: 'Id' })
  @IsNotEmpty()
  readonly userId?: string;
}

export class CreateChatDto {
  @ApiProperty(chatDtoDocs.name)
  @Expose({ name: 'Name' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty(chatDtoDocs.authorId)
  @Expose({ name: 'AuthorId' })
  @IsNotEmpty()
  readonly authorId?: string;

  @ApiProperty(chatDtoDocs.parentId)
  @Expose({ name: 'ParentId' })
  @IsOptional()
  readonly parentId?: string;

  @ApiProperty({ ...chatDtoDocs.users, type: CreateChatUserDto, isArray: true })
  @Expose({ name: 'Users' })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @ValidateNested({ each: true })
  @Type(() => CreateChatUserDto)
  readonly users: CreateChatUserDto[];
}
