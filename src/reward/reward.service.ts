import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { PrismaException, PrismaService } from '@app/common';
import { FindAllRewardDto } from './dto/find-all-reward.dto';
import { Prisma, RewardCatalogue } from '@prisma/client';

@Injectable()
export class RewardService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(merchantId: number, createRewardDto: CreateRewardDto) {
    try {
      return await this.prismaService.rewardCatalogue.create({
        data: {
          merchantId,
          ...createRewardDto,
        },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findAll(findAllRewardDto: FindAllRewardDto) {
    const where: Prisma.RewardCatalogueWhereInput = {
      title: findAllRewardDto.search
        ? { contains: findAllRewardDto.search, mode: 'insensitive' }
        : undefined,
    };

    try {
      const totalData = await this.prismaService.rewardCatalogue.count({
        where,
      });

      const rewardCatalogue = await this.prismaService.rewardCatalogue.findMany(
        {
          where,
          skip: findAllRewardDto.getSkip(),
          take: findAllRewardDto.limit,
        },
      );

      return {
        totalData,
        rewardCatalogue,
      };
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.rewardCatalogue.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findIn(idArr: number[]) {
    try {
      return await this.prismaService.rewardCatalogue.findMany({
        where: { id: { in: idArr } },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async update(id: number, updateRewardDto: UpdateRewardDto) {
    const reward = await this.findOne(id);
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    try {
      return await this.prismaService.rewardCatalogue.update({
        where: { id: reward.id },
        data: updateRewardDto,
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async remove(id: number) {
    const reward = await this.findOne(id);
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    try {
      return await this.prismaService.rewardCatalogue.delete({
        where: { id: reward.id },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
