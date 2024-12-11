import { Injectable } from '@nestjs/common';
import { PrismaException, PrismaService } from '@app/common';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { AuthService } from 'src/auth/auth.service';
import { ERole } from '@prisma/client';

@Injectable()
export class CashierService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(merchantId: number, createCashierDto: CreateCashierDto) {
    try {
      return await this.prismaService.$transaction(async (tsx) => {
        const account = await tsx.account.create({
          data: {
            username: createCashierDto.username,
            password: await this.authService.hash(createCashierDto.password),
            role: ERole.CASHIER,
          },
        });

        const cashier = await tsx.cashier.create({
          data: {
            name: createCashierDto.email,
            phoneNumber: createCashierDto.phoneNumber,
            email: createCashierDto.email,
            belongToMerchantId: merchantId,
            accountId: account.id,
          },
        });

        return { account, cashier };
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.cashier.findUnique({
        where: { id },
        include: { Merchant: true },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findByAccountId(accountId: number) {
    try {
      return await this.prismaService.cashier.findFirst({
        where: { accountId },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
