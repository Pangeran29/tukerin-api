import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { PrismaService } from '@app/common';

@Module({
  providers: [AccountService, PrismaService],
  exports: [AccountService],
})
export class AccountModule {}
