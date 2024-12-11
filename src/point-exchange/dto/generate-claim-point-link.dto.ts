import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class GenerateClaimPointLinkDto {
  @IsNotEmpty()
  @IsUrl()
  @IsString()
  redirectUri: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => PointCatalogue)
  pointCatalogueArr: PointCatalogue[];
}

class PointCatalogue {
  @IsPositive()
  pointCatalogueId: number;
}
