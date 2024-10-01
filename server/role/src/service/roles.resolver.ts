import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role } from 'src/entities/role.entity';
import { RoleService } from './roles.service';
import { CreatePermissionDto, CreateRoleDto, UpdatePermissionDto, UpdateRoleDto } from 'src/dto/role.dto';
import { Permission } from 'src/entities/permission.entity';


@Resolver(() => Role)
export class RoleResolver {
    constructor(
        private readonly roleService: RoleService
    ) { }

    // Query to get all roles, optionally paginated
    @Query(() => [Role])
    async roles(
        @Args('query', { type: () => String, nullable: true }) query?: string,
        @Args('limit', { type: () => Number, nullable: true }) limit?: number,
        @Args('offset', { type: () => Number, nullable: true }) offset?: number,
    ): Promise<Role[]> {
        return this.roleService.findAllRole({ query, limit, offset });
    }

    // Query to get a specific role by id
    @Query(() => Role)
    async route(@Args('id', { type: () => String }) id: string): Promise<Role> {
        return this.roleService.findOneRoleById(id);
    }

    // Mutation to create a new role
    @Mutation(() => Role)
    async createRole(@Args('createRoleDto') createRoleDto: CreateRoleDto): Promise<Role> {
        return this.roleService.createRole(createRoleDto);
    }

    // Mutation to update an existing role by name
    @Mutation(() => Role)
    async updateRole(
        @Args('id', { type: () => String }) id: string,
        @Args('updateRoleDto') updateRoleDto: UpdateRoleDto,
    ): Promise<Role> {
        return this.roleService.updateRoleById(id, updateRoleDto);
    }

    // Mutation to delete a route by name
    @Mutation(() => Boolean)
    async deleteRole(@Args('id', { type: () => String }) id: string): Promise<boolean> {
        await this.roleService.removeRoleById(id);
        return true;
    }


    // Query to get all permissions, optionally paginated
    @Query(() => [Permission])
    async permissions(
        @Args('query', { type: () => String, nullable: true }) query?: string,
        @Args('limit', { type: () => Number, nullable: true }) limit?: number,
        @Args('offset', { type: () => Number, nullable: true }) offset?: number,
    ): Promise<Permission[]> {
        return this.roleService.findAllPermission({ query, limit, offset });
    }

    // Query to get a specific permission by id
    @Query(() => Permission)
    async permission(@Args('id', { type: () => String }) id: string): Promise<Permission> {
        return this.roleService.findOnePermissionById(id);
    }

    // Mutation to create a new permission
    @Mutation(() => Permission)
    createPermission(@Args('createPermissionDto') createPermissionDto: CreatePermissionDto): Promise<Permission> {
        return this.roleService.createPermission(createPermissionDto);
    }

    // Mutation to update an existing permission by name
    @Mutation(() => Permission)
    async updatePermission(
        @Args('id', { type: () => String }) id: string,
        @Args('updatePermissionDto') updatePermissionDto: UpdatePermissionDto,
    ): Promise<Permission> {
        return this.roleService.updatePermissionById(id, updatePermissionDto);
    }

    // Mutation to delete a permission by name
    @Mutation(() => Boolean)
    async deletePermission(@Args('id', { type: () => String }) id: string): Promise<boolean> {
        await this.roleService.removePermissionById(id);
        return true;
    }
}
