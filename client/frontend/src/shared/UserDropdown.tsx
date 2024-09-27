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
import { useCreateUserSocial, useUser } from "../hooks/useUser";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserDropDown = () => {
  const [signedIn, setsignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, loading } = useUser();
  const { data } = useSession();
  const router = useRouter();
  const { handlecreateUserSocial } = useCreateUserSocial(data?.user);

  useEffect(() => {
    if (!loading) {
      setsignedIn(!!user);
    }
    if (data?.user) {
      setsignedIn(true);
      handlecreateUserSocial();
    }
  }, [loading, user, open, data]);

  const logoutHandler = () => {
    if (data?.user) {
      signOut();
    } else {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      toast.success("Log out successful!");
    }
    window.location.reload();
    router.push("/");
  };

  const handleNavigation = (key: any) => {
    if (key === "createRoute") {
      router.push("/");
    } else if (key === "settings") {
      router.push(`/api/profile/${user.id}`);
    }
  };

  return (
    <div className="flex items-center gap-4 ml-auto"> {/* Changed to ml-auto */}
      {signedIn ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              src={data?.user ? data.user.image : user.image}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={handleNavigation}>
            <DropdownItem key="settings" className="h-14 gap-2">
              <p className="font-semibold text-white">Signed in as</p>
              <p className="font-semibold text-white">
                {data?.user ? data.user.email : user.email}
              </p>
            </DropdownItem>
            <DropdownItem className="font-semibold text-white" key="settings">
              My Profile
            </DropdownItem>
            {/* <DropdownItem className="font-semibold text-white" key="team_settings">
              All Routes
            </DropdownItem> */}
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
        <CgProfile
          className="text-2xl cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      )}
      {open && <AuthScreen setOpen={setOpen} />}
    </div>
  );
};

export default UserDropDown;
