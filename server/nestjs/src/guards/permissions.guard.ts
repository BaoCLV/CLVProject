
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roleClient } from '../utils/grpcClient';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) =>
  Reflect.metadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());

    if (!requiredPermissions) {
      return true; // No permissions required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assume user is attached to the request after authentication

    if (!user || !user.role) {
      throw new ForbiddenException('User not authenticated or missing role');
    }

    // Fetch permissions for the user's role via gRPC
    const permissions = await this.getRolePermissions(user.role);

    // Check if user has required permissions
    const hasPermission = requiredPermissions.every(permission => permissions.includes(permission));
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  // gRPC call to get permissions for a role
  private getRolePermissions(role: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      roleClient.getRolePermissions({ role }, (error: any, response: { permissions: string[] }) => {
        if (error) {
          reject(new ForbiddenException('Failed to fetch permissions from RoleService'));
        } else {
          resolve(response.permissions);
        }
      });
    });
  }
}
