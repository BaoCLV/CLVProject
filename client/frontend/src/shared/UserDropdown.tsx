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
import { randomPassword } from "../utils/randomPassword";
import Loading from "./components/Loading";
import { useActiveUser } from "../hooks/useActivateUser";

const UserDropDown = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [password, setPassword] = useState("");

  const { activeUser, loading, GGUserData } = useActiveUser();
  const { loadingRoles, roles } = useRoles();

  // Fetch the avatar for the logged-in user
  const { loading: avatarLoading, avatar } = useGetAvatar(activeUser?.id || '');

  // Find the user's role based on user.roleId (Memoized for optimization)
  const userRole = useMemo(
    () => roles.find((role: any) => role.id === activeUser?.roleId),
    [roles, activeUser?.roleId]
  );

  // Check if the user is admin or superadmin (Memoized to avoid redundant calculations)
  const isAdmin = useMemo(
    () => userRole?.name === "admin" || userRole?.name === "Super Admin",
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
    if (GGUserData) {
      return GGUserData.image;
    }
    return "/img/default-avatar.jpg"; // Default avatar fallback
  }, [avatar, GGUserData]);

  const { handleCreateUserSocial } = useCreateUserSocial(GGUserData);
  const userCreated = typeof window !== 'undefined' && localStorage.getItem('userCreated') === 'true'; // Check if user is already created

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPassword = localStorage.getItem('generatedPassword') || '';
      setPassword(storedPassword);

      if (!storedPassword) {
        const newPassword = randomPassword();
        localStorage.setItem('generatedPassword', newPassword);
        setPassword(newPassword);
      }
    }

    if (!loading) {
      setSignedIn(!!activeUser);
    }

    if (!userCreated && GGUserData.email !== "" && signedIn === true) {
      handleCreateUserSocial(password).then(() => {
        localStorage.setItem('userCreated', 'true'); // Set the flag after user is created
      });
    }
  }, [loading, activeUser, open, password, userCreated, signedIn, GGUserData]);

  const logoutHandler = () => {
    if (GGUserData.email !== "") {
      signOut();
      console.log(GGUserData);
      router.push("/");
    } else {
      Cookies.remove("access_token", { path: '' });
      Cookies.remove("refresh_token", { path: '' });
      console.log(activeUser);
      router.push("/");
      window.location.reload();
    }
    // Clear localStorage and sessionStorage
    localStorage.removeItem('generatedPassword');
    localStorage.removeItem('userCreated');
    sessionStorage.clear();

    toast.success("Log out successfully!");
    setSignedIn(false); // Reset the signedIn state
  };

  const handleNavigation = (key: any) => {
    switch (key) {
      case "createRoute":
        router.push("/");
        break;
      case "settings":
        router.push(`/api/profile/${activeUser?.id}`);
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
      {activeUser ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              src={fixedAvatarSrc}
              alt="User Avatar"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            onAction={handleNavigation}
          >
            <DropdownItem key="settings" className="h-14 gap-2">
              <p className="font-semibold text-white">Signed in as</p>
              <p className="font-semibold text-white">
                {GGUserData?.email || activeUser?.email}
              </p >
            </DropdownItem >
            {!loadingRoles && isAdmin ? (
              <DropdownItem
                className="font-semibold text-white"
                key="dashboard"
              >
                Dashboard
              </DropdownItem>
            ) : <DropdownItem></DropdownItem>}
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
          </DropdownMenu >
        </Dropdown >
      ) : (
        <CgProfile
          className="text-2xl cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      )}
      {open && <AuthScreen setOpen={setOpen} />}
    </div >
  );
};

export default UserDropDown;
