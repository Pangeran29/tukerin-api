import { IsNotEmpty, IsString } from 'class-validator';
import { Address } from '../entities/address.entity';

export class CreateAddressDto
  implements
    Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'isActive'>
{
  @IsNotEmpty()
  @IsString()
  ricipentName: string;

  @IsNotEmpty()
  @IsString()
  ricipentPhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  subDistrict: string;

  @IsNotEmpty()
  @IsString()
  ward: string;

  @IsNotEmpty()
  @IsString()
  detailAddress: string;

  @IsNotEmpty()
  @IsString()
  otherDetail: string;

  intoAddress(userId: number): Address {
    const address = new Address();
    address.ricipentName = this.ricipentName;
    address.ricipentPhoneNumber = this.ricipentPhoneNumber;
    address.province = this.province;
    address.city = this.city;
    address.subDistrict = this.subDistrict;
    address.ward = this.ward;
    address.detailAddress = this.detailAddress;
    address.otherDetail = this.otherDetail;
    address.userId = userId;
    return address;
  }
}
