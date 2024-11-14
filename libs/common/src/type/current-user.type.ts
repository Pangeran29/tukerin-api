import { ERole } from '@prisma/client';

export type CurrentUser = {
  sub: string;
  role: ERole;
  customerId: null | number;
  cashierId: null | number;
  merchantId: null | number;
};
