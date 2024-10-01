import { ClientPermission } from '../enum/permissions.enum';

export const RolesPermissions = {
  admin: [ClientPermission.Create, ClientPermission.Read, ClientPermission.Update, ClientPermission.Delete],
  user: [ClientPermission.Create, ClientPermission.Read ], // Users can only read by default
};
