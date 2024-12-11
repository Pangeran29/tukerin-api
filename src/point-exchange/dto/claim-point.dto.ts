import { IsNotEmpty, IsString } from 'class-validator';

export class ClaimPointDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
