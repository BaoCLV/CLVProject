import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoleService } from './roles.service';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RoleService) {}

  @GrpcMethod('RoleService', 'GetRolePermissions')
  getRolePermissions(data: { role: string }) {
    const permissions = this.rolesService.getRolePermissions(data.role);
    return { permissions };
  }
}
