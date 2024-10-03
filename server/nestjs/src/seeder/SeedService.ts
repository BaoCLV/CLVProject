import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers() {
    await this.seedDefaultUser();
    await this.seedAdminUser();
  }

  // Seed the default user
  private async seedDefaultUser() {
    const existingUser = await this.userRepository.findOne({ where: { email: 'user@example.com' } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('user1234', 10); // Default password for user
      const defaultUser = this.userRepository.create({
        name: 'Default User',
        email: 'user@example.com',
        password: hashedPassword,
        roles: ['user'], // Default role 'user'
        phone_number: '1234567890',
        address: '123 User St',
      });

      await this.userRepository.save(defaultUser);
      console.log('Default user seeded successfully.');
    }
  }

  // Seed an admin user
  private async seedAdminUser() {
    const existingAdmin = await this.userRepository.findOne({ where: { email: 'admin@gmail.com' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10); // Default password for admin
      const adminUser = this.userRepository.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: hashedPassword,
        roles: ['admin'], // Admin role
        phone_number: '9876543210',
        address: '456 Admin Blvd',
      });

      await this.userRepository.save(adminUser);
      console.log('Admin user seeded successfully.');
    }
  }
}
