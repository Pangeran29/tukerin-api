import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';

export class CreateCashierDto
  extends CreateAccountDto
  implements Partial<Prisma.CashierCreateInput>
{
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
