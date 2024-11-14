import { Injectable } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaException, PrismaService } from '@app/common';
import { ERole } from '@prisma/client';

@Injectable()
export class MerchantService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(createMerchantDto: CreateMerchantDto) {
    try {
      return await this.prismaService.$transaction(async (tsx) => {
        const account = await tsx.account.create({
          data: {
            username: createMerchantDto.username,
            password: await this.authService.hash(createMerchantDto.password),
            role: ERole.MERCHANT,
          },
        });

        const merchant = await tsx.merchant.create({
          data: {
            businessName: createMerchantDto.businessName,
            businessEmail: createMerchantDto.businessEmail,
            businessPhoneNumber: createMerchantDto.businessPhoneNumber,
            businessField: createMerchantDto.businessField,
            businessAddress: createMerchantDto.businessAddress,
            provinceId: createMerchantDto.provinceId,
            regencyId: createMerchantDto.regencyId,
            districtId: createMerchantDto.districtId,
            villageId: createMerchantDto.villageId,
            accountId: account.id,
          },
        });

        return { account, merchant };
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findByAccountId(accountId: number) {
    try {
      return await this.prismaService.merchant.findFirst({
        where: { accountId },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
