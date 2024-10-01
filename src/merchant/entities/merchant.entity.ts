import { Merchant as IMerchant } from "@prisma/client";

export class Merchant implements IMerchant {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
