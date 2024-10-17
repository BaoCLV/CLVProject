import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Client } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

interface RoleServiceClient {
  GetRoleByName(data: { name: string }): Observable<{ role: { id: string } }>;
}

@Injectable()
export class SeedService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'role',
      protoPath: join('./src/protos/roles.proto'), 
      url: '0.0.0.0:5003',
    },
  })
  private roleClient: ClientGrpc;

  private roleService: RoleServiceClient;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    this.roleService = this.roleClient.getService<RoleServiceClient>('RoleService');
    await this.seedUsers();
  }

  private async seedUsers() {
    await this.seedDefaultUser();
    await this.seedAdminUser();
    await this.seedSuperAdmin();
  }

  // Seeding Super Admin User
  private async seedSuperAdmin() {
    const existingAdmin = await this.userRepository.findOne({ where: { email: 'superadmin@gmail.com' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Fetch "Super Admin" role via gRPC
      const roleResponse = await lastValueFrom(this.roleService.GetRoleByName({ name: 'Super Admin' }));
      if (!roleResponse || !roleResponse.role) {
        throw new Error('Role "Super Admin" not found');
      }
      const superAdminRoleId = roleResponse.role.id;

      // Create the Super Admin user
      const superAdminUser = this.userRepository.create({
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        password: hashedPassword,
        roleId: superAdminRoleId,  // Update to a single roleId
        phone_number: '9876543210',
        address: '456 Admin Blvd',
      });

      await this.userRepository.save(superAdminUser);
      console.log('Super Admin user seeded successfully.');
    }
  }

  // Seeding Default User
  private async seedDefaultUser() {
    const existingUser = await this.userRepository.findOne({ where: { email: 'user@example.com' } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('user1234', 10);

      // Fetch "User" role via gRPC
      const roleResponse = await lastValueFrom(this.roleService.GetRoleByName({ name: 'user' }));
      if (!roleResponse || !roleResponse.role) {
        throw new Error('Role "User" not found');
      }
      const userRoleId = roleResponse.role.id;

      // Create the Default User
      const defaultUser = this.userRepository.create({
        name: 'Default User',
        email: 'user@example.com',
        password: hashedPassword,
        roleId: userRoleId,  // Update to a single roleId
        phone_number: '1234567890',
        address: '123 User St',
      });

      await this.userRepository.save(defaultUser);
      console.log('Default user seeded successfully.');
    }
  }

  // Seeding Admin User
  private async seedAdminUser() {
    const existingAdmin = await this.userRepository.findOne({ where: { email: 'admin@gmail.com' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Fetch "Admin" role via gRPC
      const roleResponse = await lastValueFrom(this.roleService.GetRoleByName({ name: 'admin' }));
      if (!roleResponse || !roleResponse.role) {
        throw new Error('Role "Admin" not found');
      }
      const adminRoleId = roleResponse.role.id;

      // Create the Admin user
      const adminUser = this.userRepository.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: hashedPassword,
        roleId: adminRoleId,  // Update to a single roleId
        phone_number: '9876543210',
        address: '456 Admin Blvd',
      });

      await this.userRepository.save(adminUser);
      console.log('Admin user seeded successfully.');
    }
  }
}
