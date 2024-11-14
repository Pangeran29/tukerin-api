import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaService } from '@app/common';
import { AccountModule } from 'src/account/account.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService],
  exports: [CustomerService],
  imports: [AccountModule, forwardRef(() => AuthModule)],
})
export class CustomerModule {}
