import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppExceptionFilter, AppResponseInterceptor } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { CustomerModule } from './customer/customer.module';
import { MerchantModule } from './merchant/merchant.module';
import { RewardModule } from './reward/reward.module';
import { PointModule } from './point/point.module';
import { PointExchangeModule } from './point-exchange/point-exchange.module';
import { RewardExchangeModule } from './reward-exchange/reward-exchange.module';
import { CashierModule } from './cashier/cashier.module';
import { PointOnPointExchangeModule } from './point-on-point-exchange/point-on-point-exchange.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        APP_NAME: Joi.string().required(),
        PREFIX_NAME: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    AuthModule,
    AccountModule,
    CustomerModule,
    MerchantModule,
    RewardModule,
    PointModule,
    PointExchangeModule,
    RewardExchangeModule,
    CashierModule,
    PointOnPointExchangeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppResponseInterceptor,
    },
  ]
})
export class AppModule {}
