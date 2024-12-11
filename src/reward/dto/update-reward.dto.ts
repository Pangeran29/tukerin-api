import { PartialType } from '@nestjs/swagger';
import { CreateRewardDto } from './create-reward.dto';
import { Prisma } from '@prisma/client';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRewardDto
  extends PartialType(CreateRewardDto)
  implements Prisma.RewardCatalogueUpdateInput
{
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
