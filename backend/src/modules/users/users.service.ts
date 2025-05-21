import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email, deletedAt: IsNull() } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id, deletedAt: IsNull() } });
  }

  sanitize(user: User) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
