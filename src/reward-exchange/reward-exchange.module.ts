import { Module } from '@nestjs/common';
import { RewardExchangeService } from './reward-exchange.service';
import { RewardExchangeController } from './reward-exchange.controller';
import { PrismaService } from '@app/common';
import { CustomerModule } from 'src/customer/customer.module';
import { RewardModule } from 'src/reward/reward.module';

@Module({
  controllers: [RewardExchangeController],
  providers: [RewardExchangeService, PrismaService],
  imports: [CustomerModule, RewardModule]
})
export class RewardExchangeModule {}
