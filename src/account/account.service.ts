import { Injectable } from '@nestjs/common';
import { PrismaException, PrismaService } from '@app/common';

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUsername(username: string) {
    try {
      return await this.prismaService.account.findUnique({
        where: { username },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  async findById(id: number) {
    try {
      return await this.prismaService.account.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
