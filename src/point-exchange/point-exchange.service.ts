import { Injectable } from '@nestjs/common';
import { PrismaException, PrismaService } from '@app/common';
import { Prisma } from '@prisma/client';
import { FindAllPointExchangeDto } from './dto/find-all-point-exchange.dto';

@Injectable()
export class PointExchangeService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    pointExchange: Prisma.PointExchangeCreateInput,
    pointCatalogueIdArr: number[],
  ) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const pointExchange_ = await tx.pointExchange.create({
          data: pointExchange,
        });

        const pointCatalogueOnPointExchange_ =
          await tx.pointCatalogueOnPointExchange.createMany({
            data: pointCatalogueIdArr.map((pointCatalogueId) => {
              return {
                pointCatalogueId,
                pointExchangeId: pointExchange_.id,
              };
            }),
          });

        return {
          pointExchange: pointExchange_,
          pointCatalogueOnPointExchange: pointCatalogueOnPointExchange_,
        };
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findAll(
    merchantId: number,
    findAllPointExchangeDto: FindAllPointExchangeDto,
  ) {
    const where: Prisma.PointExchangeWhereInput = {
      merchantId,
      claimedAt: findAllPointExchangeDto.isClaimed
        ? findAllPointExchangeDto.isClaimed === 'true'
          ? { not: null }
          : null
        : undefined,
      Customer: {
        name: findAllPointExchangeDto.search
          ? { contains: findAllPointExchangeDto.search, mode: 'insensitive' }
          : undefined,
      },
    };

    try {
      const totalData = await this.prismaService.pointExchange.count({
        where,
      });

      const pointExchange = await this.prismaService.pointExchange.findMany({
        where,
        include: {
          Customer: true,
        },
        skip: findAllPointExchangeDto.getSkip(),
        take: findAllPointExchangeDto.limit,
      });

      return {
        totalData,
        pointExchange,
      };
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findByUuid(uuid: string) {
    console.log('here in findByUuid');
    try {
      return await this.prismaService.pointExchange.findUnique({
        where: { uuid },
        include: { Merchant: true },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findById(id: number) {
    console.log('here in findById');
    try {
      return await this.prismaService.pointExchange.findUnique({
        where: { id },
        include: { Merchant: true },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async claimPoint(uuid: string, customer: { id: number; points: number }) {
    const { id, points } = customer;
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const pointExchange = await tx.pointExchange.update({
          where: { uuid },
          data: {
            customerId: id,
            claimedAt: new Date(),
          },
        });

        const customer = await tx.customer.update({
          where: { id },
          data: {
            points,
          },
        });

        return { pointExchange, customer };
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
