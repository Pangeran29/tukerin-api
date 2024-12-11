import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaException, PrismaService } from '@app/common';
import {
  ERewardType,
  EShippingStatus,
  Prisma,
  RewardCatalogue,
} from '@prisma/client';
import {
  getTodayStartAndEndDate,
  getTodayStartAndEndMonth,
} from '@app/common/helper/date-time.helper';
import { FindAllRewardExchangeDto } from './dto/find-all-reward-exchange.dto';
import { UpdateShippingStatusDto } from './dto/update-shipping-status.dto';

@Injectable()
export class RewardExchangeService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkAvailability(reward: RewardCatalogue) {
    try {
      const { startDate, endDate } = getTodayStartAndEndDate();
      const claimedReward = await this.prismaService.rewardExchange.findMany({
        where: {
          rewardCatalogueId: reward.id,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      const { maxDailyRedeem } = reward;

      if (claimedReward.length === maxDailyRedeem) {
        throw new BadRequestException(
          'Maximum daily redeem already achieved, try again tommorow',
        );
      }
    } catch (error) {
      throw new PrismaException(error);
    }

    try {
      const { startMonth, endMonth } = getTodayStartAndEndMonth();
      const claimedReward = await this.prismaService.rewardExchange.findMany({
        where: {
          rewardCatalogueId: reward.id,
          createdAt: {
            gte: startMonth,
            lte: endMonth,
          },
        },
      });

      const { maxMonthlyRedeem } = reward;

      if (claimedReward.length === maxMonthlyRedeem) {
        throw new BadRequestException(
          'Maximum monthly redeem already achieved, try again next month',
        );
      }
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async claimReward(
    customer: { id: number; points: number },
    reward: {
      id: number;
      stock: number;
      princePoint: number;
      type: ERewardType;
    },
    merchant: { id: number },
  ) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        await tx.rewardCatalogue.update({
          where: { id: reward.id },
          data: {
            stock: reward.stock - 1,
          },
        });

        await tx.customer.update({
          where: { id: customer.id },
          data: {
            points: customer.points - reward.princePoint,
          },
        });

        await tx.customerOnMerchant.create({
          data: {
            merchantId: merchant.id,
            customerId: customer.id,
          },
        });

        const data: Prisma.RewardExchangeUncheckedCreateInput = {
          merchantId: merchant.id,
          customerId: customer.id,
          rewardCatalogueId: reward.id,
          status: undefined,
        };

        switch (reward.type) {
          case ERewardType.VOUCHER:
            data['status'] = EShippingStatus.RECEIVED;
            data['receivedAt'] = new Date();
            break;
          default:
            data['status'] = EShippingStatus.WAITING_APPROVAL;
            data['waitingApprovalAt'] = new Date();
            break;
        }

        return await tx.rewardExchange.create({
          data,
        });
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findAll(
    merchantId: number,
    findAllRewardExchangeDto: FindAllRewardExchangeDto,
  ) {
    const where: Prisma.RewardExchangeWhereInput = {
      merchantId,
      status: findAllRewardExchangeDto?.shippingStatus
        ? findAllRewardExchangeDto.shippingStatus
        : undefined,
      RewardCatalogue: {
        rewardType: findAllRewardExchangeDto?.rewardType
          ? findAllRewardExchangeDto.rewardType
          : undefined,
      },
    };

    try {
      const totalData = await this.prismaService.rewardExchange.count({
        where,
      });

      const rewardExchange = await this.prismaService.rewardExchange.findMany({
        where,
        include: {
          Customer: true,
        },
        skip: findAllRewardExchangeDto.getSkip(),
        take: findAllRewardExchangeDto.limit,
      });

      return {
        totalData,
        rewardExchange,
      };
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.rewardExchange.findUnique({
        where: { id },
        include: {
          Customer: true,
          RewardCatalogue: true,
        },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async updateShippingStatus(
    id: number,
    updateShippingStatusDto: UpdateShippingStatusDto,
  ) {
    const data: Prisma.RewardExchangeUpdateInput = {
      status: updateShippingStatusDto.status,
    };

    switch (updateShippingStatusDto.status) {
      case EShippingStatus.PROCESSED:
        data['processedAt'] = new Date();
      case EShippingStatus.DELIVERED:
        data['deliveredAt'] = new Date();
      case EShippingStatus.RECEIVED:
        data['receivedAt'] = new Date();
    }
    try {
      return await this.prismaService.rewardCatalogue.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
