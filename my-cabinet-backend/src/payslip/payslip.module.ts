import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PayslipController } from './payslip.controller';
import { PayslipService } from './payslip.service';

@Module({
  imports: [HttpModule],
  controllers: [PayslipController],
  providers: [PayslipService],
})
export class PayslipModule {}
