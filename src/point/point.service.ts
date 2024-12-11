import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PrismaException, PrismaService } from '@app/common';
import { Prisma } from '@prisma/client';
import { FindAllPointDto } from './dto/find-all-point.dto';

@Injectable()
export class PointService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(merchantId: number, createPointDto: CreatePointDto) {
    try {
      return await this.prismaService.pointCatalogue.create({
        data: {
          merchantId,
          ...createPointDto,
        },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findAll(findAllPointDto: FindAllPointDto) {
    const where: Prisma.PointCatalogueWhereInput = {
      title: findAllPointDto.search
        ? { contains: findAllPointDto.search, mode: 'insensitive' }
        : undefined,
    };

    try {
      const totalData = await this.prismaService.pointCatalogue.count({
        where,
      });

      const PointCatalogue =
        await this.prismaService.pointCatalogue.findMany({
          where,
          skip: findAllPointDto.getSkip(),
          take: findAllPointDto.limit,
        });

      return {
        totalData,
        PointCatalogue,
      };
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.pointCatalogue.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async update(id: number, updatePointDto: UpdatePointDto) {
    const Point = await this.findOne(id);
    if (!Point) {
      throw new NotFoundException('Point not found');
    }

    try {
      return await this.prismaService.pointCatalogue.update({
        where: { id: Point.id },
        data: updatePointDto,
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async remove(id: number) {
    const Point = await this.findOne(id);
    if (!Point) {
      throw new NotFoundException('Point not found');
    }

    try {
      return await this.prismaService.pointCatalogue.delete({
        where: { id: Point.id },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
