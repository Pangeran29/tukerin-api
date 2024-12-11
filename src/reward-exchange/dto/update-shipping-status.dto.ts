import { EShippingStatus, Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateShippingStatusDto
  implements Prisma.RewardExchangeUpdateInput
{
  @IsEnum(EShippingStatus)
  @IsNotEmpty()
  status: EShippingStatus;
}
