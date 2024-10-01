import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';
import { Address } from '../entities/address.entity';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  intoUpdateAddress(id: number): Address {
    const address = new Address();
    address.id = id;
    address.ricipentName = this.ricipentName;
    address.ricipentPhoneNumber = this.ricipentPhoneNumber;
    address.province = this.province;
    address.city = this.city;
    address.subDistrict = this.subDistrict;
    address.ward = this.ward;
    address.detailAddress = this.detailAddress;
    address.otherDetail = this.otherDetail;
    return address;
  }
}
