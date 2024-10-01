import { Injectable } from '@nestjs/common';
import { PrismaException, PrismaService } from '@app/common';
import { Merchant } from './entities/merchant.entity';

@Injectable()
export class MerchantService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(merchant: Merchant) {
    try {
      return await this.prismaService.merchant.create({ data: merchant });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.merchant.findMany({});
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.merchant.findUnique({ where: { id } });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async update(merchant: Merchant) {
    try {
      return await this.prismaService.merchant.update({
        where: { id: merchant.id },
        data: merchant,
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.merchant.delete({ where: { id } });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
