import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TResponseApi } from '@app/common/type/response-api.type';
import { AccountService } from 'src/account/account.service';

@ApiBearerAuth()
@ApiTags('Merchant')
@Controller('merchant')
export class MerchantController {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly accountService: AccountService,
  ) {}

  @Post('sign-up')
  async signUp(
    @Body() createMerchantDto: CreateMerchantDto,
  ): Promise<TResponseApi> {
    {
      const account = await this.accountService.findByUsername(
        createMerchantDto.username,
      );
      if (account) {
        throw new BadRequestException('Username already registered');
      }
    }

    const merchant = await this.merchantService.create(createMerchantDto);

    return {
      message: 'success to create merchant',
      data: merchant,
    };
  }
}
