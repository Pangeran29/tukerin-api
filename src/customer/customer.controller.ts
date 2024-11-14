import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AccountService } from 'src/account/account.service';
import { TResponseApi } from '@app/common/type/response-api.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly accountService: AccountService,
  ) {}

  @Post('sign-up')
  async signUp(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<TResponseApi> {
    {
      const account = await this.accountService.findByUsername(
        createCustomerDto.username,
      );
      if (account) {
        throw new BadRequestException('Username already registered');
      }
    }

    const customer = await this.customerService.create(createCustomerDto);

    return {
      message: 'success to create customer',
      data: customer,
    };
  }
}
