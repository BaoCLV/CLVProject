import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/auth/Actions/getUser.action";
import { useGraphQLClient } from "../hooks/useGraphql";
import { REGISTER_USER } from "../graphql/auth/Actions/register.action";
import toast from "react-hot-toast";
import { GET_SOCIAL_USER } from "../graphql/auth/Actions/getSocialUser.action";
import { UPDATE_USER } from "../graphql/auth/Actions/updateUser";



export const useUser = () => {
  const authClient = useGraphQLClient('auth'); // Use the auth client
  const { loading, data } = useQuery(GET_USER, { client: authClient });

  return {
    loading,
    user: data?.getLoggedInUser?.user,
  };
};

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


export const useCreateUserSocial = (userData: any) => {
  const authClient = useGraphQLClient('auth');
  const [createUser] = useMutation(REGISTER_USER, { client: authClient });
  const isUserExist = useGetUser(userData?.email);
  // const usertest = useUser()
  // console.log("usertest",usertest)
  // console.log("user existed:", isUserExist)

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
      phone_number: userData.phone_number, // Provide a default value if phone_number is not available
      address: userData.address || 'No address provided', // Provide a default value if address is not available
    }
    console.log("input data:", data)

    try {
      const response = await createUser({
        variables: data,
      });
      console.log("register:", data)
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