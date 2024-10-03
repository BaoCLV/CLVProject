import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrpcMethod } from '@nestjs/microservices';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // Fix for the roleNames being undefined: Use the correct data parameter
  @GrpcMethod('RoleService', 'GetRolesByNames')
  async getRolesByNames(data: { roleNames: string[] }): Promise<{ roles: string[] }> {
    const roles = await this.roleRepository.find({
      where: data.roleNames.map(name => ({ name })),
    });
    return { roles: roles.map(role => role.name) };
  }

  // Fix for the roleNames being undefined: Use the correct data parameter
  @GrpcMethod('RoleService', 'GetPermissionsByRoleNames')
  async getPermissionsByRoleNames(data: { roleNames: string[] }): Promise<{ permissions: string[] }> {
    const roles = await this.roleRepository.find({
      where: data.roleNames.map(name => ({ name })),
      relations: ['permissions'],
    });

    const permissions = roles.reduce((acc, role) => {
      if (role.permissions) {
        acc.push(...role.permissions.map(p => p.name));
      }
      return acc;
    }, []);

    return { permissions };
  }
}
