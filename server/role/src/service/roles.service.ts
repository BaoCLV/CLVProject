import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { GrpcMethod } from '@nestjs/microservices';
import { UpdateRoleDto } from '../dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // gRPC method to get all roles
  @GrpcMethod('RoleService', 'FindAllRoles')
  async findAllRoles(): Promise<Role[]> {
    console.log(Role)
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  // gRPC method to get all permissions
  @GrpcMethod('RoleService', 'FindAllPermissions')
  async findAllPermissions(): Promise<{ permissions: Permission[] }> {
    const permissions = await this.permissionRepository.find();
    return { permissions };
  }

  // gRPC method to get a role by its name
  @GrpcMethod('RoleService', 'GetRoleByName')
  async GetRoleByName(data: { name: string }): Promise<{ role: Role }> {
    const role = await this.roleRepository.findOne({
      where: { name: data.name },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error(`Role with name ${data.name} not found`);
    }

    return { role };
  }

  // gRPC method to update a role (name and permissions)
  @GrpcMethod('RoleService', 'UpdateRole')
  async updateRole(data: { roleId: string; name: string; permissionIds: string[] }): Promise<{ role: Role }> {
    const { roleId, name, permissionIds } = data;
    const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permissions'] });

    if (!role) {
      throw new Error('Role not found');
    }

    if (name) {
      role.name = name;
    }

    if (permissionIds && permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findByIds(permissionIds);
      role.permissions = permissions;
    }

    const updatedRole = await this.roleRepository.save(role);
    return { role: updatedRole };
  }

  // gRPC method to assign a permission to a role
  @GrpcMethod('RoleService', 'AssignPermissionToRole')
  async assignPermissionToRole(data: { roleId: string; permissionId: string }): Promise<{ role: Role }> {
    const { roleId, permissionId } = data;

    const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permissions'] });
    if (!role) {
      throw new Error('Role not found');
    }

    const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
    if (!permission) {
      throw new Error('Permission not found');
    }

    if (!role.permissions.some(p => p.id === permission.id)) {
      role.permissions.push(permission);
    }

    const updatedRole = await this.roleRepository.save(role);
    return { role: updatedRole };
  }

  async createRole(name: string, permissionIds: string[]): Promise<Role> {
    // Fetch the permissions by their IDs
    const permissions = await this.permissionRepository.findByIds(permissionIds);

    // Create the new role with the associated permissions
    const newRole = this.roleRepository.create({ name, permissions });

    // Save the new role in the database
    return this.roleRepository.save(newRole);
  }
}

