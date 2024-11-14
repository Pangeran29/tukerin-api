import { Account } from '@prisma/client';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateAccountDto implements Partial<Account> {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
