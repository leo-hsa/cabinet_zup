import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PayslipService } from './payslip.service';
import { PayslipRequestDto } from './dto/payslip-request.dto';

@Controller('payslip')
@UseGuards(JwtAuthGuard)
export class PayslipController {
  constructor(private readonly payslipService: PayslipService) {}

  @Post('pdf')
  async getPayslipPdf(
    @Body() dto: PayslipRequestDto,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.payslipService.getPayslipPdf(dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="payslip.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }
}
