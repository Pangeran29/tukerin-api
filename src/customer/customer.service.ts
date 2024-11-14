import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PrismaException, PrismaService } from '@app/common';
import { ERole } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      return await this.prismaService.$transaction(async (tsx) => {
        const account = await tsx.account.create({
          data: {
            username: createCustomerDto.username,
            password: await this.authService.hash(createCustomerDto.password),
            role: ERole.CUSTOMER,
          },
        });

        const customer = await tsx.customer.create({
          data: {
            email: createCustomerDto.email,
            name: createCustomerDto.name,
            phoneNumber: createCustomerDto.phoneNumber,
            address: createCustomerDto.address,
            provinceId: createCustomerDto.provinceId,
            regencyId: createCustomerDto.regencyId,
            districtId: createCustomerDto.districtId,
            villageId: createCustomerDto.villageId,
            accountId: account.id,
          },
        });

        return { account, customer };
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findByAccountId(accountId: number) {
    try {
      return await this.prismaService.customer.findFirst({
        where: { accountId },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
