import { Module } from '@nestjs/common';
import { DumpstersService } from './dumpsters.service';
import { DumpstersController } from './dumpsters.controller';

@Module({
  controllers: [DumpstersController],
  providers: [DumpstersService],
  exports: [DumpstersService],
})
export class DumpstersModule {}
