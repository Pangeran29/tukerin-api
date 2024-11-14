import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AccountModule } from 'src/account/account.module';
import { MerchantModule } from 'src/merchant/merchant.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    AccountModule,
    forwardRef(()=>CustomerModule),
    forwardRef(()=>MerchantModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          noTimestamp: false,
          expiresIn: configService.get('JWT_EXPIRATION'),
        },
        verifyOptions: {
          ignoreExpiration: false,
        },
      }),
    }),
  ],
  exports: [AuthService]
})
export class AuthModule {}
