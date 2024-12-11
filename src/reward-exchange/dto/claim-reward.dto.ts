import { IsNotEmpty, IsNumber } from 'class-validator';

export class ClaimRewardDto {
  @IsNotEmpty()
  @IsNumber()
  rewardId: number;
}
