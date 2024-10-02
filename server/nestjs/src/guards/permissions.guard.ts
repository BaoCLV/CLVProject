
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { roleClient } from '../utils/grpcClient';
// import { userClient } from '../utils/grpcClient';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ROLE_KEY = 'role';
export const RequirePermissions = (...role: string[]) =>
  Reflect.metadata(ROLE_KEY, role);
const rolePermissions = {
  admin: ['create', 'read', 'update', 'delete'],
  user: ['read', 'update'],
  // Add more roles and their permissions as needed
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) {
      return true; // No permissions required, allow access
    }

    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const user = req.user; // Assume user is attached to the request after authentication

    if (!user || !user.role) {
      throw new ForbiddenException('User not authenticated or missing role');
    }

    // Fetch permissions for the user's role via gRPC
    // const permissions = await this.getRolePermissions(user.role);
    const permissions = rolePermissions[user.role];

    // Check if user has required permissions
    const hasPermission = requiredPermissions.every(permission => permissions.includes(permission));
    if (!hasPermission) {
      console.log(hasPermission)
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  // gRPC call to get permissions for a role
  // private getRolePermissions(role: string): Promise<string[]> {
  //   return new Promise((resolve, reject) => {
  //     roleClient.getRolePermissions({ role }, (error: any, response: { permissions: string[] }) => {
  //       if (error) {
  //         reject(new ForbiddenException('Failed to fetch permissions from RoleService'));
  //       } else {
  //         resolve(response.permissions);
  //       }
  //     });
  //   });
  // }
}
