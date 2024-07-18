import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto, RegisterDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterResponse, LoginResponse, ErrorType } from './dto/response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const { name, email, password } = registerDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      return {
        error: {
          message: 'User with this email already exists',
          code: 'USER_EXISTS',
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const savedUser = await this.userRepository.save(user);
    return {
      user: savedUser,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        user: user,
      };
    } else {
      return {
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
      };
    }
  }

  async getUser(): Promise<User[]> {
    return this.userRepository.find();
  }
}
