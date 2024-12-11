import { Module } from '@nestjs/common';
import { PointOnPointExchangeService } from './point-on-point-exchange.service';
import { PrismaService } from '@app/common';

@Module({
  providers: [PointOnPointExchangeService, PrismaService],
  exports: [PointOnPointExchangeService],
})
export class PointOnPointExchangeModule {}
