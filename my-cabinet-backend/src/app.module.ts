import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayslipModule } from './payslip/payslip.module';

@Module({
  imports: [PayslipModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
