import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { CurrentUser, GetCurrentUser, JwtAuthGuard } from '@app/common';
import { AccountService } from 'src/account/account.service';
import { CustomerService } from 'src/customer/customer.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { ERole } from '@prisma/client';
import { TResponseApi } from '@app/common/type/response-api.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
    private readonly merchantService: MerchantService,
  ) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<TResponseApi> {
    const account = await this.accountService.findByUsername(
      signInDto.username,
    );
    if (!account) {
      throw new UnauthorizedException(
        'Account either not found or the provided password not valid',
      );
    }

    const validatePassword = await this.authService.compareHashed(
      signInDto.password,
      account.password,
    );
    if (!validatePassword) {
      throw new UnauthorizedException(
        'Account either not found or the provided password not valid',
      );
    }

    const payloadAccessToken: CurrentUser = {
      sub: account.username,
      role: account.role,
      customerId: null,
      cashierId: null,
      merchantId: null,
    };

    switch (account.role) {
      case ERole.CUSTOMER:
        const customer = await this.customerService.findByAccountId(account.id);
        if (!customer) {
          throw new NotFoundException('Customer not found');
        }
        payloadAccessToken.customerId = customer.id;
        break;
      case ERole.MERCHANT:
        const merchant = await this.merchantService.findByAccountId(account.id);
        if (!merchant) {
          throw new NotFoundException('Merchant not found');
        }
        payloadAccessToken.merchantId = merchant.id;
        break;
      case ERole.CASHIER:
        break;
      default:
        throw new UnauthorizedException('Account not associate with any role');
    }

    const token = await this.authService.getAccessToken(payloadAccessToken);

    return {
      message: 'Success sign in',
      data: {
        ...account,
        token,
      },
    };
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@GetCurrentUser() currentUser: CurrentUser): Promise<TResponseApi> {
    const account = await this.accountService.findByUsername(currentUser.sub);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return {
      message: 'Success to get current user data',
      data: account,
    };
  }
}
