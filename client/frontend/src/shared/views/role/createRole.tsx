import { useState, useEffect } from "react";
import { useCreateRole, usePermissions } from '@/src/hooks/useRole';
  // Import the custom hook

interface CreateRoleProps {
  onClose: () => void;
}

interface Permission {
  id: string;
  name: string;
}

const CreateRole = ({ onClose }: CreateRoleProps) => {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const { createRole, loading: createLoading, error: createError } = useCreateRole();
  const {  permissions } = usePermissions();  // Fetch permissions

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions((prevPermissions) => {
      if (prevPermissions.includes(permissionId)) {
        return prevPermissions.filter((id) => id !== permissionId);  // Remove if already selected
      } else {
        return [...prevPermissions, permissionId];  // Add if not selected
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRole(roleName, selectedPermissions);  // Create the role with permissions
      onClose();  // Close the modal after successful creation
    } catch (err) {
      console.error("Error creating role:", err);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Create New Role</h2>

      {/* Role Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Role Name</label>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="mt-1 block w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          placeholder="Enter role name"
          required
        />
      </div>

      {/* Permission Selection (Multiple Checkboxes) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Permissions</label>
        <div className="mt-2 grid grid-cols-2 gap-4">
        {permissions.map((permission: Permission ) => (
            <div key={permission.id} className="flex items-center">
              <input
                type="checkbox"
                id={permission.id}
                value={permission.id}
                checked={selectedPermissions.includes(permission.id)}
                onChange={() => handlePermissionChange(permission.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={permission.id} className="ml-2 block text-sm text-gray-700">
                {permission.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {createError && <p className="text-red-500">{createError.message}</p>}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          disabled={createLoading}
        >
          {createLoading ? "Creating..." : "Create Role"}
        </button>
      </div>
    </form>
  );
};

export default CreateRole;
