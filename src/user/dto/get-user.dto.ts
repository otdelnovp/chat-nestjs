import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { userDtoDocs } from '../user.docs';

export class GetUserDto {
  @ApiProperty(userDtoDocs.id)
  @Expose({ name: 'id' })
  @IsOptional()
  readonly Id?: string;

  @ApiProperty(userDtoDocs.name)
  @Expose({ name: 'name' })
  @IsNotEmpty()
  readonly Name: string;

  @ApiProperty(userDtoDocs.email)
  @Expose({ name: 'email' })
  @IsEmail()
  readonly Email?: string;

  @ApiProperty(userDtoDocs.phone)
  @Expose({ name: 'phone' })
  @IsOptional()
  readonly Phone?: number;
}
