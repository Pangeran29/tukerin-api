import { IPagination } from '@app/common/interface/pagination.query.interface';
import { ISearch } from '@app/common/interface/search.query.interface';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class FindAllPointDto implements IPagination, ISearch {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  getSkip(): number {
    return (this.page - 1) * this.limit;
  }
}
