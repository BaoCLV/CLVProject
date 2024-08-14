import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { Response } from 'express';
// import { PrismaService } from 'prisma/Prima.service';

@Injectable()
export class UsersService {
  constructor(
    // private readonly jwtService: JwtService,
    // private readonly prisma: PrismaService,
    // private readonly configService: ConfigService
  ) {}

  async register(RegisterDto: RegisterDto ) {
    const { name, email, password} = RegisterDto;
    const user = {
      name,
      email,
      password,
    };
    return user;
  }

  async Login( LoginDto: LoginDto){
    const {email, password} = LoginDto;
    const user = {
      email,
      password,
    };
    return user;
  }
  async getUser() {
    const users = []
    return users
  }
}
