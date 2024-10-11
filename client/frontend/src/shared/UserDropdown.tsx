"use client";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import AuthScreen from "../shared/screens/AuthScreen";
import { useCreateUserSocial, useUser, useGetAvatar } from "../hooks/useUser";
import { useRoles } from "../hooks/useRole"; // Use the useRoles hook
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserDropDown = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, loading: userLoading } = useUser();
  const { data } = useSession();
  const router = useRouter();
  const { handlecreateUserSocial } = useCreateUserSocial(data?.user);

  // Fetch the avatar for the logged-in user
  const { loading: avatarLoading, avatar, error: avatarError } = useGetAvatar(user?.id);

  // Fetch all roles and compare the user's roleId with the role.id
  const { loadingRoles, errorRoles, roles } = useRoles();

  // Find the user's role based on user.roleId
  const userRole = roles.find((role: any) => role.id === user?.roleId);

  // Check if the user is admin or superadmin
  const isAdmin = userRole?.name === "admin" || userRole?.name === "superadmin";

  // Fix the avatar string format if needed
  const fixedAvatarSrc = avatar?.imageDataBase64
    ? avatar.imageDataBase64.replace("dataimage/jpegbase64", "data:image/jpeg;base64,")
    : "/img/default-avatar.jpg"; // Default avatar fallback

  useEffect(() => {
    if (!userLoading) {
      setSignedIn(!!user);
    }
    if (data?.user) {
      setSignedIn(true);
      handlecreateUserSocial();
    }
  }, [userLoading, user, open, data]);

  const logoutHandler = () => {
    if (data?.user) {
      signOut();
    } else {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      toast.success("Log out successful!");
    }
    router.push("/");
  };

  const handleNavigation = (key: any) => {
    if (key === "createRoute") {
      router.push("/");
    } else if (key === "settings") {
      router.push(`/api/profile/${user?.id}`);
    } else if (key === "dashboard") {
      router.push(`/admin/dashboard`);
    }
  };

  return (
    <div className="flex items-center z-50 gap-4 ml-auto">
      {signedIn ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              // Display the avatar from DB or fallback to default
              src={ fixedAvatarSrc}
              alt="User Avatar"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={handleNavigation}>
            <DropdownItem key="settings" className="h-14 gap-2">
              <p className="font-semibold text-white">Signed in as</p>
              <p className="font-semibold text-white">
                {data?.user ? data.user.email : user?.email}
              </p>
            </DropdownItem>
            {!loadingRoles && isAdmin ? (
              <DropdownItem className="font-semibold text-white" key="dashboard">
                Dashboard
              </DropdownItem>
            ) : null}

            <DropdownItem className="font-semibold text-white" key="settings">
              My Profile
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              className="font-semibold text-white"
              onClick={logoutHandler}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <CgProfile className="text-2xl cursor-pointer" onClick={() => setOpen(!open)} />
      )}
      {open && <AuthScreen setOpen={setOpen} />}
    </div>
  );
};

export default UserDropDown;
