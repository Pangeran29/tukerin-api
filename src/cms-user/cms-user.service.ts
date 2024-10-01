import { PrismaException, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { CmsUser } from './entities/cms-user.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';

@Injectable()
export class CmsUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(cmsUser: CmsUser, merchant?: Merchant) {
    return await this.prismaService.$transaction(async (tx) => {
      try {
        if (merchant) {
          merchant = await tx.merchant.create({ data: merchant });
          cmsUser.merchantId = merchant.id;
        }

        return await tx.userCMS.create({
          data: {
            ...cmsUser,
          },
          include: { Merchant: true },
        });
      } catch (error) {
        throw new PrismaException(error);
      }
    });
  }

  async update(cmsUser: CmsUser) {
    try {
      return await this.prismaService.userCMS.update({
        where: { id: cmsUser.id },
        data: cmsUser,
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findById(userId: number) {
    try {
      return await this.prismaService.userCMS.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prismaService.userCMS.findFirst({
        where: { email },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
