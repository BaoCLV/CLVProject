import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RoleService } from './roles.service';
import { UpdateRoleDto } from '../dto/role.dto';

@Resolver(() => Role)
export class RoleResolver {
  constructor(
    private readonly rolePermissionService: RoleService,
  ) {}

  // Query to get all roles with their permissions
  @Query(() => [Role])
  async findAllRoles(): Promise<Role[]> {
    const { roles } = await this.rolePermissionService.findAllRoles();
    return roles;
  }

  // Query to get all permissions
  @Query(() => [Permission])
  async findAllPermissions(): Promise<Permission[]> {
    const { permissions } = await this.rolePermissionService.findAllPermissions();
    return permissions;
  }

  // Mutation to update a role (name and permissions)
  @Mutation(() => Role)
  async updateRole(
    @Args('roleId', { type: () => String }) roleId: string,
    @Args('updateRoleInput') updateRoleInput: UpdateRoleDto,
  ): Promise<Role> {
    const data = {
      roleId,
      name: updateRoleInput.name,
      permissionIds: updateRoleInput.permissionIds,
    };
    const { role } = await this.rolePermissionService.updateRole(data);
    return role;
  }

  // Mutation to assign a permission to a role
  @Mutation(() => Role)
  async assignPermissionToRole(
    @Args('roleId', { type: () => String }) roleId: string,
    @Args('permissionId', { type: () => String }) permissionId: string,
  ): Promise<Role> {
    const { role } = await this.rolePermissionService.assignPermissionToRole({ roleId, permissionId });
    return role;
  }
}
