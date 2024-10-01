import { UserCMS } from "@prisma/client";

export class CmsUser implements UserCMS {
  id: number;
  merchantId: number;
  phoneNumber: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
