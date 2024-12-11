import { Module } from '@nestjs/common';
import { PointExchangeService } from './point-exchange.service';
import { PointExchangeController } from './point-exchange.controller';
import { PrismaService } from '@app/common';
import { PointModule } from 'src/point/point.module';
import { CashierModule } from 'src/cashier/cashier.module';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerModule } from 'src/customer/customer.module';
import { PointOnPointExchangeModule } from 'src/point-on-point-exchange/point-on-point-exchange.module';

@Module({
  controllers: [PointExchangeController],
  providers: [PointExchangeService, PrismaService],
  imports: [PointModule, CashierModule, AuthModule, CustomerModule, PointOnPointExchangeModule]
})
export class PointExchangeModule {}
