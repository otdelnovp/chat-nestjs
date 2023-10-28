import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { userDtoDocs } from '../user.docs';

export class CreateUserResponseDto {
  @ApiProperty(userDtoDocs.created)
  @Expose({ name: 'created' })
  readonly created: number;

  @ApiProperty(userDtoDocs.updated)
  @Expose({ name: 'updated' })
  readonly updated: number;
}
