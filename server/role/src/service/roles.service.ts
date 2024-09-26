import { Injectable } from '@nestjs/common';
import { RoleRequest, RoleResponse } from '../';

@Injectable()
export class RoleService {
  private readonly rolePermissions = {
    admin: ['read', 'write', 'delete', 'update'],
    user: ['read', 'update'],
    guest: ['read'],
  };

  getRolePermissions(request: RoleRequest): RoleResponse {
    const permissions = this.rolePermissions[request.role] || [];
    return { permissions };
  }
}
