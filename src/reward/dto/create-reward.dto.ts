import { IsMultipleOf100 } from '@app/common/decorator/is-multiple-of-100.decorator';
import { $Enums, Prisma } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateRewardDto
  implements Partial<Prisma.RewardCatalogueCreateInput>
{
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  termAndCondition: string;

  @IsNotEmpty()
  @IsMultipleOf100()
  pricePoint: number;

  @IsNotEmpty()
  @IsEnum($Enums.ERewardType)
  rewardType: $Enums.ERewardType;

  @IsNotEmpty()
  @IsPositive()
  stock: number;

  @IsNotEmpty()
  @IsPositive()
  maxDailyRedeem: number;

  @IsNotEmpty()
  @IsPositive()
  maxMonthlyRedeem: number;

  @IsNotEmpty()
  @IsPositive()
  viewOrder: number;

  @IsNotEmpty()
  @IsDate()
  periodeStart: Date;

  @IsNotEmpty()
  @IsDate()
  periodeEnd: Date;
}
