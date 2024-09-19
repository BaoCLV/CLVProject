import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @GrpcMethod('RoleService', 'GetRolePermissions')
  getRolePermissions(data: { role: string }) {
    const permissions = this.rolesService.getPermissionsByRole(data.role);
    return { permissions };
  }
}
