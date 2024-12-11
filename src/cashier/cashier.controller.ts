import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CashierService } from './cashier.service';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { TResponseApi } from '@app/common/type/response-api.type';
import { AccountService } from 'src/account/account.service';
import {
  CurrentUser,
  GetCurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '@app/common';
import { ERole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Cashier')
@ApiBearerAuth()
@Controller('cashier')
export class CashierController {
  constructor(
    private readonly cashierService: CashierService,
    private readonly accountService: AccountService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.MERCHANT)
  @Post('sign-up')
  async signUp(
    @GetCurrentUser() currentUser: CurrentUser,
    @Body() createCashierDto: CreateCashierDto,
  ): Promise<TResponseApi> {
    {
      const account = await this.accountService.findByUsername(
        createCashierDto.username,
      );
      if (account) {
        throw new BadRequestException('Username already registered');
      }
    }

    const merchantId = currentUser.merchantId;
    const merchant = await this.cashierService.create(
      merchantId,
      createCashierDto,
    );

    return {
      message: 'success to create cashier',
      data: merchant,
    };
  }
}
