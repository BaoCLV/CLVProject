// /hooks/usePermissionsAndRoles.ts
import { useQuery } from '@apollo/client';
import { GET_ALL_PERMISSIONS} from '../graphql/role/Action/GetAllPermission';
import { GET_ALL_ROLES } from '../graphql/role/Action/GetAllRoles';

// Hook to fetch all permissions
export const usePermissions = () => {
  const { loading: loadingPermissions, error: errorPermissions, data: permissionsData } = useQuery(GET_ALL_PERMISSIONS);

  return {
    loadingPermissions,
    errorPermissions,
    permissions: permissionsData?.findAllPermissions || [],
  };
};

// Hook to fetch all roles
export const useRoles = () => {
  const { loading: loadingRoles, error: errorRoles, data: rolesData } = useQuery(GET_ALL_ROLES);

  return {
    loadingRoles,
    errorRoles,
    roles: rolesData?.findAllRoles || [],
  };
};
