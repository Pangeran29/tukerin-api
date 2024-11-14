import { Merchant } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';

export class CreateMerchantDto
  extends CreateAccountDto
  implements Partial<Merchant>
{
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsEmail()
  @IsNotEmpty()
  businessEmail: string;

  @IsString()
  @IsNotEmpty()
  businessPhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  businessField: string;

  @IsString()
  @IsNotEmpty()
  businessAddress: string;

  @IsPositive()
  @IsNotEmpty()
  provinceId: number;

  @IsPositive()
  @IsNotEmpty()
  regencyId: number;

  @IsPositive()
  @IsNotEmpty()
  districtId: number;

  @IsPositive()
  @IsNotEmpty()
  villageId: number;
}
