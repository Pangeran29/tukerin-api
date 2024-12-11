import { IsMultipleOf100 } from '@app/common/decorator/is-multiple-of-100.decorator';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePointDto
  implements Partial<Prisma.PointCatalogueCreateInput>
{
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  termAndCondition: string;

  @IsNotEmpty()
  @IsMultipleOf100()
  point: number;
}
