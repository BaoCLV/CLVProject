// /hooks/usePermissionsAndRoles.ts
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_PERMISSIONS} from '../graphql/role/Action/GetAllPermission';
import { GET_ALL_ROLES } from '../graphql/role/Action/GetAllRoles';
import { CREATE_ROLE } from '../graphql/role/Action/createRole';
import { UPDATE_ROLE } from '../graphql/role/Action/UpdateRole';

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
  const { loading, error, data } = useQuery(GET_ALL_ROLES);

  return {
    loadingRoles: loading,
    errorRoles: error,
    roles: data?.findAllRoles || [],
  };
};

export const useCreateRole = () => {
  const [createRoleMutation, { data, loading, error }] = useMutation(CREATE_ROLE);

  const createRole = async (name: string, permissionIds: string[]) => {
    try {
      const response = await createRoleMutation({
        variables: { name, permissionIds },
      });
      return response.data.createRole;
    } catch (e) {
      throw e;
    }
  };

  return {
    createRole,
    data,
    loading,
    error,
  };
};

export const useUpdateRole = ()  => {
  const [updateRoleMutation, { loading, error }] = useMutation(UPDATE_ROLE);

  // Wrapper function to handle the mutation
  const updateRole = async (roleId: string, updateRoleInput: string[]) => {
    try {
      const response = await updateRoleMutation({
        variables: {
          roleId,
          updateRoleInput,
        },
      });
      return response.data.updateRole;
    } catch (err) {
      throw err;
    }
  };

  return { updateRole, loading, error };
};