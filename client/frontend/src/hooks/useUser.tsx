import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/auth/Actions/getUser.action";
import { useGraphQLClient } from "../hooks/useGraphql";
import { REGISTER_USER } from "../graphql/auth/Actions/register.action";
import toast from "react-hot-toast";
import { GET_SOCIAL_USER } from "../graphql/auth/Actions/getSocialUser.action";
import { UPDATE_USER } from "../graphql/auth/Actions/updateUser";
import { GET_ALL_USER } from "../graphql/auth/Actions/getAllUser.action";
import { useInfiniteQuery } from "react-query";
import { routeClient } from "../graphql/route/route.gql.setup";
import { GET_USER_BY_ID } from "../graphql/auth/Actions/getUserById.action";
import DELETE_USER from "../graphql/auth/Actions/deleteUser.action";
import { CREATE_USER } from "../graphql/auth/Actions/createUserByAdmin";


//get loggedin user
export const useUser = () => {
  const authClient = useGraphQLClient('auth');
  const { loading, data } = useQuery(GET_USER, { client: authClient });

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
  });

  const user = data?.getUserByEmail?.user;
  return {
    loading,
    error,
    user: user
  };
};

//create user by google
export const useCreateUserSocial = (userData: any) => {
  const authClient = useGraphQLClient('auth');
  const [createUser] = useMutation(REGISTER_USER, { client: authClient });
  const isUserExist = useGetUser(userData?.email);

  const randomPassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()-_=+";
    const charactersLength = 8;

    const uniqueCharacters = [...Array.from(new Set(characters))];

    let password = "";

    for (let i = 0; i < charactersLength; i++) {
      const randomIndex = Math.floor(Math.random() * uniqueCharacters.length);
      password += uniqueCharacters[randomIndex];
    }

    return password;
  };

  const handlecreateUserSocial = async () => {

    if (isUserExist) {
      return isUserExist;
    }

    const data = {
      name: userData.name,
      email: userData.email,
      password: randomPassword(),
      phone_number: userData.phone_number,
      address: userData.address || 'No address provided',
    }

    try {
      const response = await createUser({
        variables: data,
      });
      localStorage.setItem(
        "activation_token",
        response.data.register.activation_token
      );
      toast.success("Register successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return { handlecreateUserSocial };
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
          address: data.address
        },
      });
      // localStorage.setItem(
      //   "activation_token",
      //   response.data.register.activation_token
      // );
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

//update user infor
export const useUpdateUser = () => {
  const authClient = useGraphQLClient('auth');
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER, {
    client: authClient,
  });

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      const response = await updateUser({
        variables: {
          id: userId,
          name: userData.name,
          phone_number: userData.phone_number,
          address: userData.address
        },
      });

      if (response?.data?.updateUser?.user) {
        toast.success('User updated successfully!');
        return response.data.updateUser.user;
      } else {
        toast.error('Failed to update user.');
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
      console.error('Error updating user:', err);
    }
  };

  return {
    handleUpdateUser,
    loading,
    error,
  };
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

