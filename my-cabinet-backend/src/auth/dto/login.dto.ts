import { IsString, Length, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(12, 12, { message: 'ИИН должен содержать ровно 12 цифр' })
  iin: string;

  @IsString()
  @Length(6, 128)
  password: string;

  @IsOptional()
  @IsString()
  device_info?: string;
}
