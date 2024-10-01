import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesPermissions } from '../permission/roles.permission';

// Create a custom decorator to set required permissions
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permissions[]) =>
  Reflect.metadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required permissions from the handler (route)
    const requiredPermissions = this.reflector.get<Permissions[]>(PERMISSIONS_KEY, context.getHandler());

    if (!requiredPermissions) {
      // No permissions required, allow access
      return true;
    }

    // Get the user from the request (assuming user is already validated and attached)
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('User not authenticated');
    }

    // Fetch the permissions for the user's role
    const userPermissions = RolesPermissions[user.role] || [];

    // Check if the user has all required permissions
    const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
