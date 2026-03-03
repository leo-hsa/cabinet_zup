import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findByIin(dto.iin);
    if (!user) {
      throw new UnauthorizedException('Неверный ИИН или пароль');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Аккаунт деактивирован');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordValid) {
      throw new UnauthorizedException('Неверный ИИН или пароль');
    }

    const tokens = await this.generateTokens(user.id, user.iin);
    await this.saveRefreshToken(user.id, tokens.refresh_token, dto.device_info);

    return tokens;
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; iin: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Невалидный или истекший refresh token');
    }

    const storedTokens = await this.refreshTokenRepo.find({
      where: { user_id: payload.sub },
    });

    let matchedToken: RefreshToken | null = null;
    for (const stored of storedTokens) {
      if (await bcrypt.compare(refreshToken, stored.token_hash)) {
        matchedToken = stored;
        break;
      }
    }

    if (!matchedToken) {
      throw new UnauthorizedException('Refresh token не найден или отозван');
    }

    if (matchedToken.expires_at < new Date()) {
      await this.refreshTokenRepo.remove(matchedToken);
      throw new UnauthorizedException('Refresh token истёк');
    }

    await this.refreshTokenRepo.remove(matchedToken);

    const tokens = await this.generateTokens(payload.sub, payload.iin);
    await this.saveRefreshToken(payload.sub, tokens.refresh_token);

    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      return;
    }

    const storedTokens = await this.refreshTokenRepo.find({
      where: { user_id: payload.sub },
    });

    for (const stored of storedTokens) {
      if (await bcrypt.compare(refreshToken, stored.token_hash)) {
        await this.refreshTokenRepo.remove(stored);
        return;
      }
    }
  }

  private async generateTokens(userId: string, iin: string) {
    const payload = { sub: userId, iin };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as any,
      }),
    ]);

    return { access_token, refresh_token };
  }

  private async saveRefreshToken(
    userId: string,
    rawToken: string,
    deviceInfo?: string,
  ): Promise<void> {
    const tokenHash = await bcrypt.hash(rawToken, 10);

    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const expiresAt = new Date();
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];
      const ms: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
      expiresAt.setTime(expiresAt.getTime() + value * ms[unit]);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    const token = this.refreshTokenRepo.create({
      user_id: userId,
      token_hash: tokenHash,
      device_info: deviceInfo,
      expires_at: expiresAt,
    });

    await this.refreshTokenRepo.save(token);
  }
}
