import { forwardRef, Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { MerchantController } from './merchant.controller';
import { PrismaService } from '@app/common';
import { AuthModule } from 'src/auth/auth.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  controllers: [MerchantController],
  providers: [MerchantService, PrismaService],
  exports: [MerchantService],
  imports: [forwardRef(() => AuthModule), AccountModule],
})
export class MerchantModule {}
