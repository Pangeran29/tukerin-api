import { PrismaException, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PointOnPointExchangeService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByPointExchangeId(id: number) {
    try {
      return await this.prismaService.pointCatalogueOnPointExchange.findMany({
        where: { pointExchangeId: id },
        include: { PointCatalogue: true },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
