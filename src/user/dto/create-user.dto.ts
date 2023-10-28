import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { userDtoDocs } from '../user.docs';

export class CreateUserDto {
  @ApiProperty(userDtoDocs.id)
  @Expose({ name: 'Id' })
  @IsOptional()
  readonly id?: string;

  @ApiProperty(userDtoDocs.name)
  @Expose({ name: 'Name' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty(userDtoDocs.email)
  @Expose({ name: 'Email' })
  @IsEmail()
  readonly email?: string;

  @ApiProperty(userDtoDocs.phone)
  @Expose({ name: 'Phone' })
  @IsOptional()
  readonly phone?: number;
}
