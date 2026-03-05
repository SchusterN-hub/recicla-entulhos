import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DumpstersModule } from './dumpsters/dumpsters.module';
import { RentalsModule } from './rentals/rentals.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DumpstersModule,
    RentalsModule,
  ],
})
export class AppModule {}
