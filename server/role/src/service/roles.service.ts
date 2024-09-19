import { Injectable } from '@nestjs/common';
import { Permissions } from '../enum/permissions.enum';

@Injectable()
export class RolesService {
  // Define roles and their permissions
  private rolesPermissions = {
    admin: [Permissions.CREATE, Permissions.READ, Permissions.UPDATE, Permissions.DELETE],
    user: [Permissions.READ],
  };

  // Fetch permissions by role
  getPermissionsByRole(role: string): string[] {
    return this.rolesPermissions[role] || [];
  }
}
