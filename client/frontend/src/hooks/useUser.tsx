import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/auth/Actions/getUser.action";
import { useGraphQLClient } from "../hooks/useGraphql";
import { REGISTER_USER } from "../graphql/auth/Actions/register.action";
import toast from "react-hot-toast";
import { GET_SOCIAL_USER } from "../graphql/auth/Actions/getSocialUser.action";
import { UPDATE_USER } from "../graphql/auth/Actions/updateUser";
import { GET_ALL_USER } from "../graphql/auth/Actions/getAllUser.action";
import { useInfiniteQuery } from "react-query";
import { GET_USER_BY_ID } from "../graphql/auth/Actions/getUserById.action";
import DELETE_USER from "../graphql/auth/Actions/deleteUser.action";
import { CREATE_USER } from "../graphql/auth/Actions/createUserByAdmin";
import { GET_TOTALS } from "../graphql/auth/Actions/countUser";
import { useRouter } from "next/navigation";
import { GET_TOTAL_USERS_FOR_MONTH } from "../graphql/auth/Actions/totalMonthUser";
import { UPLOAD_AVATAR } from "../graphql/auth/Actions/Avatar.action";
import { GET_AVATAR } from "../graphql/auth/Actions/Avatar";
import { GET_ALL_USER_NO_QUERY } from "../graphql/auth/Actions/getAllUserNoQuery";
import { randomPassword } from "../utils/randomPassword";
import { UPDATE_TOKEN_FOR_GG_USER } from "../graphql/auth/Actions/updateTokenGGUser";
import { CHANGE_PASSWORD } from "../graphql/auth/Actions/changePassword";


//get loggedin user
export const useUser = () => {
  const authClient = useGraphQLClient('auth');
  const router = useRouter();

  const { loading, data, error } = useQuery(GET_USER, { client: authClient });

  // Check for the custom error and redirect to the home page
  if (error && error.message.includes('redirect_to_home')) {
    router.push('/');
  }

  return {
    loading,
    user: data?.getLoggedInUser?.user,
  };
};

//get single user by id
export const useGetUserById = (id: string) => {
  const authClient = useGraphQLClient('auth'); // Use the auth client
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id },
    client: authClient,
    skip: !id
  });

  const user = data?.getUserById?.user;
  return {
    loading,
    error,
    user: user
  };
};

//get single user by email
export const useGetUser = (email: string) => {
  const authClient = useGraphQLClient('auth'); // Use the auth client
  const { data, loading, error } = useQuery(GET_SOCIAL_USER, {
    variables: { email },
    client: authClient,
    skip: !email, // Skip query if email is undefined or empty
  });

  const user = data?.getUserByEmail?.user;
  return {
    loading,
    error,
    user: user || null
  };
};

//create user by google
export const useCreateUserSocial = (userData: any) => {
  const authClient = useGraphQLClient('auth');
  const [createUser] = useMutation(REGISTER_USER, { client: authClient });
  const [updateToken] = useMutation(UPDATE_TOKEN_FOR_GG_USER, { client: authClient });
  const isUserExist = useGetUser(userData?.email);

  const handleCreateUserSocial = async (password: string) => {
    console.log("CALL HANDLE")
    if (isUserExist.user) {
      console.log("isUserExist", isUserExist)
      return isUserExist;
    }

    if (!password) {
      password = randomPassword();
    }

    console.log("password", password)

    const data = {
      name: userData.name,
      email: userData.email,
      password: password,
      phone_number: userData.phone_number || "No phone number provided",
      address: userData.address || 'No address provided',
    }

    try {
      console.log("data", data)

      const response = await createUser({
        variables: data,
      });
      localStorage.setItem(
        "activation_token",
        response.data.register.activation_token
      );

      const update = await updateToken({
        variables: { email: data.email }
      });

      console.log("update", update)

      toast.success("Register successfully");
    } catch (error: any) {
      toast.error(error.message);
    }

  }

  return { handleCreateUserSocial };
};

//create user
export const useCreateUser = () => {
  const authClient = useGraphQLClient('auth');
  const [createUser] = useMutation(CREATE_USER, { client: authClient });

  const handlecreateUser = async (data: {
    name: string,
    email: string,
    password: string,
    phone_number: string,
    address: string
  }) => {

    try {
      const response = await createUser({
        variables: {
          name: data.name,
          email: data.email,
          password: data.password,
          phone_number: data.phone_number,
          address: data.address,
        },
      });
      localStorage.setItem(
        "activation_token",
        response.data.register.activation_token
      );

      if (response.errors) {
        throw new Error(response.errors[0].message);
      }
      return response.data.createUser;
    } catch (error: any) {
      toast.error("Error creating user: " + error.message);
    }
  }

  return { handlecreateUser };
};

export const useUpdateUser = () => {
  const authClient = useGraphQLClient('auth');  // Use the correct GraphQL client for authentication
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER, {
    client: authClient,  // Use the authenticated client
  });

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      const response = await updateUser({
        variables: {
          id: userId,
          name: userData.name,
          phone_number: userData.phone_number,
          address: userData.address,
          roleId: userData.roleId
        },
      });

      if (response?.data?.updateUser?.user) {
        toast.success('User updated successfully!');
        return response.data.updateUser.user;  // Return updated user object
      } else {
        toast.error('Failed to update user.');
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
      console.error('Error updating user:', err);
    }
  };

  return { handleUpdateUser, loading, error };  // Expose loading and error states
};



// Hook for getting a list of routes with optional query, limit, and offset
export const useGetAllUser = (currentPage: number, itemsPerPage: number) => {
  const authClient = useGraphQLClient('auth');

  return useInfiniteQuery(
    ['user', currentPage], // Use currentPage in the query key for caching
    async ({ pageParam = currentPage }) => {
      const offset = (pageParam - 1) * itemsPerPage;

      const { data } = await authClient.query({
        query: GET_ALL_USER,
        variables: {
          limit: itemsPerPage,
          offset: offset,
        },
      });

      console.log({ data })

      if (!data?.getAllUsers) {
        throw new Error('Failed to fetch users');
      }
      return data.getAllUsers.users;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.length < itemsPerPage) return undefined; // No more pages
        return allPages.length + 1;
      },
      getPreviousPageParam: (firstPage, allPages) => {
        if (allPages.length === 1) return undefined;
        return allPages.length - 1;
      },
    }
  );
};

export const useTotalsUser = () => {
  const authClient = useGraphQLClient('auth');
  const { data, loading, error } = useQuery(GET_TOTALS, { client: authClient });

  // Returning the results along with loading and error states
  return {
    totalUsers: data?.totalUsers || 0,
    loading,
    error,
  };
};
// Hook for deleting a user
export const useDeleteUser = () => {
  const authClient = useGraphQLClient('auth');
  const [deleteUser] = useMutation(DELETE_USER, { client: authClient });

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await deleteUser({
        variables: { id },
      });
      return response.data.deleteUser;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  return { handleDeleteUser };
};

export const useTotalsUserForMonth = (year: number, month: number) => {
  const authClient = useGraphQLClient('auth');

  const { data, loading, error } = useQuery(GET_TOTAL_USERS_FOR_MONTH, {
    client: authClient,
    variables: { year, month },
  });

  return {
    totalUsersMonth: data?.totalUsersForMonth || 0,
    loading,
    error,
  };
};

export const useUploadAvatar = () => {
  const authClient = useGraphQLClient('auth');

  const [uploadAvatar, { data, loading, error }] = useMutation(UPLOAD_AVATAR, { client: authClient });

  const handleUploadAvatar = async (userId: string, imageDataBase64: string) => {
    try {
      const response = await uploadAvatar({
        variables: { userId, imageDataBase64 },
      });
      return response;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      throw err;
    }
  };

  return {
    handleUploadAvatar,
    data,
    loading,
    error,
  };
};

export const useGetAvatar = (userId: string) => {
  const authClient = useGraphQLClient('auth');

  const shouldSkip = !userId;

  const { data, loading, error } = useQuery(GET_AVATAR, {
    client: authClient,
    variables: { userId },
    skip: shouldSkip,
  });

  return {
    avatar: data?.getAvatar || null,
    loading,
    error,
  }
}

export const getAllUserNoQuery = () => {
  const authClient = useGraphQLClient('auth');
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_ALL_USER_NO_QUERY, { client: authClient });

  // Returning the results along with loading and error states
  return {
    user: userData?.findAllUser || [],
    userLoading,
    userError
  };
};

export const useChangePassword = () => {
  const authClient = useGraphQLClient('auth');  // Use the correct GraphQL client for authentication
  const [changePassword, { loading, error }] = useMutation(CHANGE_PASSWORD, {
    client: authClient,  // Use the authenticated client
  });

  const handleChangePassword = async (newPassword: any, oldPassword: any, userId: any) => {
    try {
      const response = await changePassword({
        variables: {
          changePasswordDto: {
            newPassword: newPassword,
            oldPassword: oldPassword,
            userID: userId,
          },
        },
      });

      if (response?.data?.changePassword?.user) {
        toast.success('User updated successfully!');
        return response.data.changePassword?.user;  // Return updated user object
      } else {
        toast.error('Failed change password');
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
      console.error('Error changing password:', err);
    }
  };

  return { handleChangePassword, loading, error };  // Expose loading and error states
};