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
  Query,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PointExchangeService } from './point-exchange.service';
import {
  CurrentUser,
  GetCurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '@app/common';
import { ERole, Prisma } from '@prisma/client';
import { PointService } from 'src/point/point.service';
import { GenerateClaimPointLinkDto } from './dto/generate-claim-point-link.dto';
import { CashierService } from 'src/cashier/cashier.service';
import { TResponseApi } from '@app/common/type/response-api.type';
import { AuthService } from 'src/auth/auth.service';
import { TClaimPointTokenPayload } from './type/claim-point-token-payload.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClaimPointDto } from './dto/claim-point.dto';
import { CustomerService } from 'src/customer/customer.service';
import { PointOnPointExchangeService } from 'src/point-on-point-exchange/point-on-point-exchange.service';
import { FindAllPointExchangeDto } from './dto/find-all-point-exchange.dto';

@ApiTags('Point Exchange')
@ApiBearerAuth()
@Controller('point-exchange')
export class PointExchangeController {
  constructor(
    private readonly pointExchangeService: PointExchangeService,
    private readonly pointService: PointService,
    private readonly cashierService: CashierService,
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    private readonly pointOnPointExchangeService: PointOnPointExchangeService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.MERCHANT)
  @Get()
  async findAll(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() findAllPointExchangeDto: FindAllPointExchangeDto,
  ): Promise<TResponseApi> {
    const merchantId = currentUser.merchantId;
    const data = await this.pointExchangeService.findAll(
      merchantId,
      findAllPointExchangeDto,
    );
    return {
      message: 'Success to find all point exchange',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.CASHIER)
  @Post('generate-claim-point-link')
  async create(
    @GetCurrentUser() currentUser: CurrentUser,
    @Body() generateClaimPointLinkDto: GenerateClaimPointLinkDto,
  ): Promise<TResponseApi> {
    const { pointCatalogueArr } = generateClaimPointLinkDto;
    let totalClaimPoint = 0;
    const pointCatalogueIdArr: number[] = [];

    for (let i = 0; i < pointCatalogueArr.length; i++) {
      const val = pointCatalogueArr[i];
      const pointCatalogue = await this.pointService.findOne(
        val.pointCatalogueId,
      );
      if (!pointCatalogue) {
        throw new NotFoundException('Point catalogue not found');
      }
      totalClaimPoint += pointCatalogue.point;
      pointCatalogueIdArr.push(pointCatalogue.id);
    }

    const cashierId = currentUser.cashierId;
    const cashier = await this.cashierService.findOne(cashierId);
    if (!cashier) {
      throw new NotFoundException('Cashier not found');
    }

    const { Merchant } = cashier;
    if (!Merchant.id) {
      throw new NotFoundException('Merchant not found');
    }

    const pointExchangeCreateInput: Prisma.PointExchangeCreateInput = {
      totalClaimPoint,
      Cashier: { connect: { id: cashierId } },
      Merchant: { connect: { id: Merchant.id } },
    };

    const { pointExchange } = await this.pointExchangeService.create(
      pointExchangeCreateInput,
      pointCatalogueIdArr,
    );

    const payload: TClaimPointTokenPayload = { uuid: pointExchange.uuid };
    const token = await this.authService.jwtSignAsync(payload, {
      issuer: 'Tukerin App',
      expiresIn: '7d',
    });

    const { redirectUri } = generateClaimPointLinkDto;

    return {
      message: 'Success to generate claim point link',
      data: {
        claimPointUri: redirectUri + '?token=' + token,
      },
    };
  }

  @Get('claim-point')
  async findClaimPoint(
    @Query() claimPointDto: ClaimPointDto,
  ): Promise<TResponseApi> {
    const { token } = claimPointDto;

    const tokenPayload: TClaimPointTokenPayload =
      await this.authService.jwtVerifyAsync(token);

    if (!tokenPayload?.uuid) {
      throw new UnauthorizedException('Token not valid');
    }

    const pointExchange = await this.pointExchangeService.findByUuid(
      tokenPayload.uuid,
    );
    if (!pointExchange) {
      throw new NotFoundException('Point exchange transaction not found');
    }

    const pointOnPointExchange =
      await this.pointOnPointExchangeService.findByPointExchangeId(
        pointExchange.id,
      );

    return {
      message: 'Success to get detail point exchange',
      data: {
        totalClaimPoint: pointExchange.totalClaimPoint,
        createdAt: pointExchange.createdAt,
        claimedAt: pointExchange.claimedAt,
        merchant: {
          name: pointExchange.Merchant.businessName,
          address: pointExchange.Merchant.businessAddress,
          email: pointExchange.Merchant.businessEmail,
          phoneNumber: pointExchange.Merchant.businessPhoneNumber,
        },
        detailPurchase: pointOnPointExchange.map((val) => {
          return {
            name: val.PointCatalogue.title,
            description: val.PointCatalogue.description,
            point: val.PointCatalogue.point,
          };
        }),
      },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.CUSTOMER)
  @Post('claim-point')
  async claimPoint(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() claimPointDto: ClaimPointDto,
  ): Promise<TResponseApi> {
    const { token } = claimPointDto;
    const { customerId } = currentUser;

    const customer = await this.customerService.findById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const tokenPayload: TClaimPointTokenPayload =
      await this.authService.jwtVerifyAsync(token);

    if (!tokenPayload?.uuid) {
      throw new UnauthorizedException('Token not valid');
    }

    const pointExchange = await this.pointExchangeService.findByUuid(
      tokenPayload.uuid,
    );
    if (!pointExchange) {
      throw new NotFoundException('Point exchange transaction not found');
    }

    if (pointExchange.claimedAt) {
      throw new BadRequestException('Point already claimed');
    }

    const customerPoints = customer.points + pointExchange.totalClaimPoint;
    const claimPoint = await this.pointExchangeService.claimPoint(
      tokenPayload.uuid,
      { id: customerId, points: customerPoints },
    );

    return {
      message: 'Success to claim point',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TResponseApi> {
    const pointExchange = await this.pointExchangeService.findById(+id);
    if (!pointExchange) {
      throw new NotFoundException('Point exchange not found');
    }
    return {
      message: 'Success to find one point exchange',
      data: pointExchange,
    };
  }
}
