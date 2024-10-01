import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class RegisterDto
  implements Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'points'>
{
  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  intoUser() {
    const user = new User();
    user.phoneNumber = this.phoneNumber;
    user.email = this.email;
    user.name = this.name;
    user.password = this.password;
    return user;
  }
  
  setPassword(password: string) {
    this.password = password;
  }
}
