import { Permissions } from '../enum/permissions.enum';

export const RolesPermissions = {
  admin: [Permissions.CREATE, Permissions.READ, Permissions.UPDATE, Permissions.DELETE],
  user: [Permissions.READ], // Users can only read by default
};
