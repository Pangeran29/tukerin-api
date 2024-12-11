import { IPagination } from '@app/common/interface/pagination.query.interface';
import { ISearch } from '@app/common/interface/search.query.interface';
import { ERewardType, EShippingStatus } from '@prisma/client';
import {
  IsEnum,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class FindAllRewardExchangeDto implements IPagination, ISearch {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  @IsEnum(ERewardType)
  @IsOptional()
  rewardType?: ERewardType;

  @IsEnum(EShippingStatus)
  @IsOptional()
  shippingStatus?: EShippingStatus;

  getSkip(): number {
    return (this.page - 1) * this.limit;
  }
}
