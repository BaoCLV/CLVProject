// src/routes/routes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto, CreateRoleDto, UpdatePermissionDto, UpdateRoleDto } from 'src/dto/role.dto';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';


@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // Create a new role
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(createRoleDto);
    console.log(newRole)
    return this.roleRepository.save(newRole);
  }

  async findAllRole({
    query,
    limit,
    offset,
  }: { query?: string; limit?: number; offset?: number }): Promise<Role[]> {
    const qb = this.roleRepository.createQueryBuilder('role');
  
    // Apply query filtering if provided
    if (query) {
      qb.where(
        'role.name LIKE :query',
        {
          query: `%${query}%`,
        },
      );
    }
  
    // Apply offset if provided
    if (offset) {
      qb.skip(offset);
    }
  
    // Apply limit if provided
    if (limit) {
      qb.take(limit);
    }
  
    qb.orderBy('role.id', 'DESC');
  
    return qb.getMany();
  }
  

  // Find a role by id
  async findOneRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    console.log(role)
    if (!role) {
      throw new NotFoundException(`Role with id "${id}" not found`);
    }
    return role;
  }

  // Update a role by id
  async updateRoleById(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOneRoleById(id);
    Object.assign(role, updateRoleDto); // Merge updates into the existing route
    return this.roleRepository.save(role);
  }

  // Remove a role by id
  async removeRoleById(id: string): Promise<void> {
    const role = await this.findOneRoleById(id);
    console.log(role)
    await this.roleRepository.remove(role);
  }


  // Create a new Permission
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const newPermission = this.permissionRepository.create(createPermissionDto);
    console.log(newPermission)
    return this.permissionRepository.save(newPermission);
  }

  async findAllPermission({
    query,
    limit,
    offset,
  }: { query?: string; limit?: number; offset?: number }): Promise<Permission[]> {
    const qb = this.permissionRepository.createQueryBuilder('permission');
  
    // Apply query filtering if provided
    if (query) {
      qb.where(
        'permission.name LIKE :query',
        {
          query: `%${query}%`,
        },
      );
    }
  
    // Apply offset if provided
    if (offset) {
      qb.skip(offset);
    }
  
    // Apply limit if provided
    if (limit) {
      qb.take(limit);
    }
  
    qb.orderBy('permission.id', 'DESC');
  
    return qb.getMany();
  }
  

  // Find a Permission by id
  async findOnePermissionById(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    console.log(permission)
    if (!permission) {
      throw new NotFoundException(`Permission with id "${id}" not found`);
    }
    return permission;
  }

  // Update a Permission by id
  async updatePermissionById(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.findOnePermissionById(id);
    Object.assign(permission, updatePermissionDto); // Merge updates into the existing route
    return this.permissionRepository.save(permission);
  }

  // Remove a Permission by id
  async removePermissionById(id: string): Promise<void> {
    const permission = await this.findOnePermissionById(id);
    console.log(permission)
    await this.permissionRepository.remove(permission);
  }
}
