import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PointService } from './point.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  GetCurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '@app/common';
import { ERole } from '@prisma/client';
import { TResponseApi } from '@app/common/type/response-api.type';
import { FindAllPointDto } from './dto/find-all-point.dto';

@ApiBearerAuth()
@ApiTags('Point')
@Roles(ERole.MERCHANT, ERole.CASHIER, ERole.CUSTOMER)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Roles(ERole.MERCHANT)
  @Post()
  async create(
    @GetCurrentUser() currentUser: CurrentUser,
    @Body() createPointDto: CreatePointDto,
  ): Promise<TResponseApi> {
    const merchantId = currentUser.merchantId;
    const point = await this.pointService.create(merchantId, createPointDto);
    return { message: 'Success to create point', data: point };
  }

  @Get()
  async findAll(
    @Query() findAllPointDto: FindAllPointDto,
  ): Promise<TResponseApi> {
    const point = await this.pointService.findAll(findAllPointDto);
    return { message: 'Success to find all point', data: point };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TResponseApi> {
    const point = await this.pointService.findOne(+id);
    return { message: 'Success to find one point', data: point };
  }

  @Roles(ERole.MERCHANT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePointDto: UpdatePointDto,
  ): Promise<TResponseApi> {
    const point = await this.pointService.update(+id, updatePointDto);
    return { message: 'Success to update point', data: point };
  }

  @Roles(ERole.MERCHANT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TResponseApi> {
    const point = await this.pointService.remove(+id);
    return { message: 'Success to remove point', data: point };
  }
}
