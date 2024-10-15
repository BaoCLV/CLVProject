"use client";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useEffect, useState, useMemo } from "react";
import { CgProfile } from "react-icons/cg";
import AuthScreen from "../shared/screens/AuthScreen";
import { useCreateUserSocial, useUser, useGetAvatar } from "../hooks/useUser";
import { useRoles } from "../hooks/useRole";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserDropDown = () => {
  const [open, setOpen] = useState(false);
  const { user, loading: userLoading } = useUser();
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { handlecreateUserSocial } = useCreateUserSocial(sessionData?.user);

  // Fetch the avatar for the logged-in user
  const { loading: avatarLoading, avatar } = useGetAvatar(user?.id);

  // Fetch all roles and compare the user's roleId with the role.id
  const { loadingRoles, roles } = useRoles();

  // Find the user's role based on user.roleId (Memoized for optimization)
  const userRole = useMemo(
    () => roles.find((role: any) => role.id === user?.roleId),
    [roles, user?.roleId]
  );

  // Check if the user is admin or superadmin (Memoized to avoid redundant calculations)
  const isAdmin = useMemo(
    () => userRole?.name === "admin" || userRole?.name === "superadmin",
    [userRole]
  );

  // Fix the avatar string format (Memoized for efficiency)
  const fixedAvatarSrc = useMemo(() => {
    if (avatar?.imageDataBase64) {
      return avatar.imageDataBase64.replace(
        "dataimage/jpegbase64",
        "data:image/jpeg;base64,"
      );
    }
    return "/img/default-avatar.jpg"; // Default avatar fallback
  }, [avatar]);

  // Handle user session and creation of social user
  useEffect(() => {
    if (user && sessionData?.user) {
      handlecreateUserSocial();
    }
  }, [user, sessionData?.user, handlecreateUserSocial]);

  const logoutHandler = () => {
    if (sessionData?.user) {
      signOut();
    } else {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      toast.success("Log out successful!");
    }
    router.push("/");
  };

  const handleNavigation = (key: any) => {
    switch (key) {
      case "createRoute":
        router.push("/");
        break;
      case "settings":
        router.push(`/api/profile/${user?.id}`);
        break;
      case "dashboard":
        router.push(`/admin/dashboard`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center z-50 gap-4 ml-auto">
      {user ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              src={fixedAvatarSrc}
              alt="User Avatar"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={handleNavigation}>
            <DropdownItem key="settings" className="h-14 gap-2">
              <p className="font-semibold text-white">Signed in as</p>
              <p className="font-semibold text-white">
                {sessionData?.user?.email || user?.email}
              </p>
            </DropdownItem>
            {!loadingRoles && isAdmin && (
              <DropdownItem className="font-semibold text-white" key="dashboard">
                Dashboard
              </DropdownItem>
            )}
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
