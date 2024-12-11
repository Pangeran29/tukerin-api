import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { FindAllRewardDto } from './dto/find-all-reward.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TResponseApi } from '@app/common/type/response-api.type';
import { CurrentUser, GetCurrentUser, JwtAuthGuard, Roles, RolesGuard } from '@app/common';
import { ERole } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('Reward')
@Roles(ERole.MERCHANT, ERole.CASHIER, ERole.CUSTOMER)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Roles(ERole.MERCHANT)
  @Post()
  async create(
    @GetCurrentUser() currentUser: CurrentUser,
    @Body() createRewardDto: CreateRewardDto,
  ): Promise<TResponseApi> {
    const merchantId = currentUser.merchantId;
    const reward = await this.rewardService.create(merchantId, createRewardDto);
    return { message: 'Success to create reward', data: reward };
  }

  @Get()
  async findAll(
    @Query() findAllRewardDto: FindAllRewardDto,
  ): Promise<TResponseApi> {
    const reward = await this.rewardService.findAll(findAllRewardDto);
    return { message: 'Success to find all reward', data: reward };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TResponseApi> {
    const reward = await this.rewardService.findOne(+id);
    return { message: 'Success to find one reward', data: reward };
  }

  @Roles(ERole.MERCHANT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRewardDto: UpdateRewardDto,
  ): Promise<TResponseApi> {
    const reward = await this.rewardService.update(+id, updateRewardDto);
    return { message: 'Success to update reward', data: reward };
  }

  @Roles(ERole.MERCHANT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TResponseApi> {
    const reward = await this.rewardService.remove(+id);
    return { message: 'Success to remove reward', data: reward };
  }
}
