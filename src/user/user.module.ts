import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '@app/common';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
