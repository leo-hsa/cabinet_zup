import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: [{ iin: dto.iin }, { email: dto.email }],
    });

    if (existing) {
      throw new ConflictException('Пользователь с таким ИИН или email уже существует');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      iin: dto.iin,
      email: dto.email,
      phone_number: dto.phone_number,
      password_hash: passwordHash,
      c1_guid: dto.c1_guid,
    });

    return this.userRepository.save(user);
  }

  async findByIin(iin: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { iin },
      select: ['id', 'iin', 'email', 'password_hash', 'is_active'],
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'iin', 'email', 'phone_number', 'c1_guid', 'is_active', 'created_at'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'iin', 'email', 'phone_number', 'c1_guid', 'is_active', 'created_at', 'updated_at'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (dto.password) {
      user.password_hash = await bcrypt.hash(dto.password, 10);
    }

    if (dto.email !== undefined) user.email = dto.email;
    if (dto.phone_number !== undefined) user.phone_number = dto.phone_number;
    if (dto.c1_guid !== undefined) user.c1_guid = dto.c1_guid;
    if (dto.is_active !== undefined) user.is_active = dto.is_active;

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Пользователь не найден');
    }
  }
}
