import { useState } from 'react';
import { useGetUser, useUser } from './useUser';
import { useSession } from 'next-auth/react';

export const useActiveUser = () => {
    const { data } = useSession(); // Fetch user if logged in via Google
    const userEmailByGoogle = data?.user?.email || '';
    const GGUserData = {
        name: data?.user?.name || '',
        email: data?.user?.email || '',
        image: data?.user?.image || ''
    };

    const useGGAccount = !!userEmailByGoogle;

    let user = null;
    let loading = false;
  
    // Conditionally call hooks based on login method
    if (useGGAccount) {
      const googleResult = useGetUser(userEmailByGoogle);
      user = googleResult.user;
      loading = googleResult.loading;
    } else {
      const userResult = useUser();
      user = userResult.user;
      loading = userResult.loading;
    }
  
    const activeUser = useGGAccount ? user : user;
    return { activeUser, loading, GGUserData };
};
