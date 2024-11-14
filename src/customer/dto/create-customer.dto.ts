import { Customer } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';

export class CreateCustomerDto extends CreateAccountDto implements Partial<Customer> {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsPositive()
  provinceId: number;

  @IsNotEmpty()
  @IsPositive()
  regencyId: number;

  @IsNotEmpty()
  @IsPositive()
  districtId: number;

  @IsNotEmpty()
  @IsPositive()
  villageId: number;
}
