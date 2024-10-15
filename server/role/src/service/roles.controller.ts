import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoleService } from './roles.service';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @GrpcMethod('RoleService', 'FindAllRoles')
  async findAllRoles(): Promise< Role[] > {
    return this.roleService.findAllRoles();
  }

  @GrpcMethod('RoleService', 'FindAllPermissions')
  async findAllPermissions(): Promise<{ permissions: Permission[] }> {
    return this.roleService.findAllPermissions();
  }

  @GrpcMethod('RoleService', 'GetRoleByName')
  async getRoleByName(data: { name: string }): Promise<{ role: Role }> {
    return this.roleService.GetRoleByName(data);
  }

  @GrpcMethod('RoleService', 'UpdateRole')
  async updateRole(data: { roleId: string; name: string; permissionIds: string[] }): Promise<{ role: Role }> {
    return this.roleService.updateRole(data);
  }

  @GrpcMethod('RoleService', 'AssignPermissionToRole')
  async assignPermissionToRole(data: { roleId: string; permissionId: string }): Promise<{ role: Role }> {
    return this.roleService.assignPermissionToRole(data);
  }
}
