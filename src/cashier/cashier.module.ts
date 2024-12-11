import { forwardRef, Module } from '@nestjs/common';
import { CashierService } from './cashier.service';
import { CashierController } from './cashier.controller';
import { PrismaService } from '@app/common';
import { AuthModule } from 'src/auth/auth.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  controllers: [CashierController],
  providers: [CashierService, PrismaService],
  exports: [CashierService],
  imports: [forwardRef(() => AuthModule), AccountModule],
})
export class CashierModule {}
