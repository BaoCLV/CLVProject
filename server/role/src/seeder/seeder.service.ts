import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { ClientRole } from '../enum/role.enum';
import { ClientPermission } from '../enum/permissions.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async onModuleInit() {
    await this.seedPermissions();
    await this.seedRolesWithPermissions();
  }

  /**
   * Seed all permissions from the enum `ClientPermission`.
   */
  private async seedPermissions() {
    const permissions = Object.values(ClientPermission);

    for (const permission of permissions) {
      const exists = await this.permissionRepository.findOne({
        where: { name: permission },
      });

      if (!exists) {
        const newPermission = this.permissionRepository.create({
          name: permission,
        });
        await this.permissionRepository.save(newPermission);
      }
    }
  }

  /**
   * Seed all roles from the enum `ClientRole` and assign default permissions.
   */
  private async seedRolesWithPermissions() {
    const roles = Object.values(ClientRole);

    for (const role of roles) {
      const roleExists = await this.roleRepository.findOne({
        where: { name: role },
      });

      if (!roleExists) {
        // Create new role
        const newRole = this.roleRepository.create({
          name: role,
        });

        // Assign all permissions to the Admin role
        if (role === ClientRole.Admin) {
          const allPermissions = await this.permissionRepository.find();
          newRole.permissions = allPermissions; // Admin gets all permissions
        }

        await this.roleRepository.save(newRole);
      }
    }
  }
}
