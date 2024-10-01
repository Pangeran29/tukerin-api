import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { CmsUser } from 'src/cms-user/entities/cms-user.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';

export class CmsRegisterDto
  implements
    Omit<CmsUser, 'id' | 'createdAt' | 'updatedAt' | 'points' | 'merchantId'>,
    Omit<Merchant, 'id' | 'createdAt' | 'updatedAt'>
{
  // CMS USER
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  password: string;

  // MERCHANT
  @IsNotEmpty()
  @IsString()
  merchantName: string;

  intoUser() {
    const user = new CmsUser();
    user.phoneNumber = this.phoneNumber;
    user.email = this.email;
    user.name = this.name;
    user.password = this.password;
    return user;
  }

  intoMerchant(): Merchant {
    const merchant = new Merchant();
    merchant.name = this.merchantName;
    return merchant;
  }

  setPassword(password: string) {
    this.password = password;
  }
}
