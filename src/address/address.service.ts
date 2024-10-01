import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaException, PrismaService } from '@app/common';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(address: Address) {
    try {
      return await this.prismaService.address.create({ data: address });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.address.findMany({
        orderBy: { isActive: 'desc' },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findOne(id: number) {
    try {
      const address = await this.prismaService.address.findUnique({
        where: { id },
      });
      if (!address) {
        throw new NotFoundException('Address not foud');
      }
      return address;
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async update(address: Address) {
    try {
      return await this.prismaService.address.update({
        where: { id: address.id },
        data: address,
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.address.delete({
        where: { id },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async updateActiveAddress(
    newActiveAddressId: number,
    oldActiveAddressId?: number,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      if (oldActiveAddressId) {
        try {
          await tx.address.update({
            where: { id: oldActiveAddressId },
            data: { isActive: false },
          });
        } catch (error) {
          throw new PrismaException(error);
        }
      }

      try {
        return await tx.address.update({
          where: { id: newActiveAddressId },
          data: { isActive: true },
        });
      } catch (error) {
        throw new PrismaException(error);
      }
    });
  }

  async findActiveAddress() {
    try {
      return await this.prismaService.address.findFirst({
        where: { isActive: true },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
