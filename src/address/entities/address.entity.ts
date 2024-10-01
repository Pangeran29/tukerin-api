import { Address as IAddress } from "@prisma/client";

export class Address implements IAddress {
  isActive: boolean;
  id: number;
  userId: number;
  ricipentName: string;
  ricipentPhoneNumber: string;
  province: string;
  city: string;
  subDistrict: string;
  ward: string;
  detailAddress: string;
  otherDetail: string;
  createdAt: Date;
  updatedAt: Date;
}
