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
import { GET_TOTALS } from "../graphql/auth/Actions/countUser";
import { useRouter } from "next/navigation";


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
          email: userData.email,
          phone_number: userData.phone_number,
          address: userData.address,
          role: userData.role,
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
  // const [getAllUser] = useQuery(GET_ALL_USER, { client: authClient });

  return useInfiniteQuery(
    ['users', currentPage], // Use currentPage in the query key for caching
    async ({ pageParam = currentPage }) => {
      const offset = (pageParam - 1) * itemsPerPage;

      const { data } = await authClient.query({
        query: GET_ALL_USER,
        variables: {
          limit: itemsPerPage,
          offset: offset,
        },
      });

      if (!data?.users) {
        throw new Error('Failed to fetch users');
      }
      console.log(data.users)

      return data.users;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < itemsPerPage) return undefined; // No more pages
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
  const { data, loading, error } = useQuery(GET_TOTALS, {client: authClient});

  // Returning the results along with loading and error states
  return {
    totalUsers: data?.totalUsers || 0,
    loading,
    error,
  };
};

