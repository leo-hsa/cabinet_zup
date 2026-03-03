import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consent } from './entities/consent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consent])],
  exports: [TypeOrmModule],
})
export class ConsentModule {}
