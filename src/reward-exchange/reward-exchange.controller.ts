import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { RewardExchangeService } from './reward-exchange.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClaimRewardDto } from './dto/claim-reward.dto';
import {
  CurrentUser,
  GetCurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '@app/common';
import { ERole } from '@prisma/client';
import { TResponseApi } from '@app/common/type/response-api.type';
import { CustomerService } from 'src/customer/customer.service';
import { RewardService } from 'src/reward/reward.service';
import { FindAllRewardExchangeDto } from './dto/find-all-reward-exchange.dto';
import { UpdateShippingStatusDto } from './dto/update-shipping-status.dto';

@ApiTags('Reward Exchange')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reward-exchange')
export class RewardExchangeController {
  constructor(
    private readonly rewardExchangeService: RewardExchangeService,
    private readonly customerService: CustomerService,
    private readonly rewardService: RewardService,
  ) {}

  @Roles(ERole.MERCHANT)
  @Get()
  async findAll(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() findAllRewardExchangeDto: FindAllRewardExchangeDto,
  ): Promise<TResponseApi> {
    const merchantId = currentUser.merchantId;
    const rewardExchange = this.rewardExchangeService.findAll(
      merchantId,
      findAllRewardExchangeDto,
    );
    return {
      message: 'Success to find all reward exchange',
      data: rewardExchange,
    };
  }

  @Roles(ERole.CUSTOMER)
  @Post('claim-reward')
  async create(
    @GetCurrentUser() currentUser: CurrentUser,
    @Body() claimRewardDto: ClaimRewardDto,
  ): Promise<TResponseApi> {
    const customerId = currentUser.customerId;

    const customer = await this.customerService.findById(customerId);
    {
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
    }

    const reward = await this.rewardService.findOne(claimRewardDto.rewardId);
    {
      if (!reward) {
        throw new NotFoundException('Reward not found');
      }

      if (reward.stock === 0) {
        throw new BadRequestException('Reward out of stock');
      }

      if (!reward.isActive) {
        throw new BadRequestException('Reward is not active');
      }

      const today = new Date();
      if (today < reward.periodeStart) {
        throw new BadRequestException('Reward expired');
      }
      if (today > reward.periodeEnd) {
        throw new BadRequestException('Reward expired');
      }

      await this.rewardExchangeService.checkAvailability(reward);

      const { points } = customer;
      if (points < reward.pricePoint) {
        throw new BadRequestException('Point is not sufficient');
      }
    }

    const rewardExchange = await this.rewardExchangeService.claimReward(
      { id: customer.id, points: customer.points },
      {
        id: reward.id,
        stock: reward.stock,
        princePoint: reward.pricePoint,
        type: reward.rewardType,
      },
      { id: reward.merchantId },
    );

    return {
      message: 'Success to claim reward',
      data: rewardExchange,
    };
  }

  @Roles(ERole.MERCHANT, ERole.CUSTOMER)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TResponseApi> {
    const rewardExchange = await this.rewardExchangeService.findOne(+id);
    if (!rewardExchange) {
      throw new NotFoundException('Reward exchange not found');
    }

    return {
      message: 'Success to find one reward exchange',
      data: rewardExchange,
    };
  }

  @Roles(ERole.MERCHANT, ERole.CUSTOMER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    updateShippingStatusDto: UpdateShippingStatusDto,
  ) {
    {
      const rewardExchange = await this.rewardExchangeService.findOne(+id);
      if (!rewardExchange) {
        throw new NotFoundException('Reward exchange not found');
      }
    }

    const rewardExchange =
      await this.rewardExchangeService.updateShippingStatus(
        +id,
        updateShippingStatusDto,
      );

    return {
      message: 'Success to find one reward exchange',
      data: rewardExchange,
    };
  }
}
