import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PayslipRequestDto } from './dto/payslip-request.dto';

@Injectable()
export class PayslipService {
  private readonly baseUrl = 'http://localhost/ZUP/hs/employee';

  constructor(private readonly httpService: HttpService) {}

  async getPayslipPdf(dto: PayslipRequestDto): Promise<Buffer> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/payslip/pdf`, dto, {
          responseType: 'arraybuffer',
        }),
      );
      return Buffer.from(response.data);
    } catch (error) {
      throw new HttpException(
        error.response?.data?.toString() || 'Failed to fetch payslip PDF from 1C',
        error.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
