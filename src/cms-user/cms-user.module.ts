import { Module } from '@nestjs/common';
import { CmsUserService } from './cms-user.service';
import { PrismaService } from '@app/common';

@Module({
  providers: [CmsUserService, PrismaService],
  exports: [CmsUserService],
})
export class CmsUserModule {}
