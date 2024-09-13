"use client";

import styles from "../../../utils/styles";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import toast from "react-hot-toast";
import { LOGIN_USER } from "../../../graphql/auth/Actions/login.action";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { signIn } from "next-auth/react";
import { useGraphQLClient } from "../../../hooks/useGraphql";
import { FcGoogle } from "react-icons/fc";

// Define the form schema using Zod for validation
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
});

// Define the form schema type
type LoginSchema = z.infer<typeof formSchema>;

const Login = ({
  setActiveState,
  setOpen,
}: {
  setActiveState: (e: string) => void;
  setOpen: (e: boolean) => void;
}) => {
  // Use authClient for authentication operations
  const authClient = useGraphQLClient("auth");

  // Initialize mutation with authClient
  const [login, { loading }] = useMutation(LOGIN_USER, { client: authClient });

  // React Hook Form setup with Zod resolver for validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const [show, setShow] = useState(false); // Toggle password visibility

  // Handle form submission
  const onSubmit = async (data: LoginSchema) => {
    try {
      const loginData = {
        email: data.email,
        password: data.password,
      };

      // Execute the login mutation
      const response = await login({
        variables: loginData,
      });

      if (response.data.login.user) {
        toast.success("Login Successful!");
        // Set authentication tokens in cookies
        Cookies.set("refresh_token", response.data.login.refreshToken);
        Cookies.set("access_token", response.data.login.accessToken);
        setOpen(false); // Close login modal
        reset(); // Reset form fields
      } else {
        toast.error(response.data.login.error.message);
      }
    } catch (error) {
      toast.error("An error occurred during login.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>CLVProject Welcome</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Enter your Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="email"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">{errors.email.message}</span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your password
          </label>
          <input
            {...register("password")}
            type={show ? "text" : "password"}
            placeholder="password"
            className={`${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
        <div className="w-full mt-5">
          <span
            className={`${styles.label} text-[#2190ff] block text-right cursor-pointer`}
            onClick={() => setActiveState("Forgot-Password")}
          >
            Forgot your password?
          </span>
          <input
            type="submit"
            value="Login"
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-3`}
          />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[16px] text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3"
          onClick={() => signIn()}
        >
          <FcGoogle size={30} className="cursor-pointer mr-2" />
        </div>

        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Not have any account?
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("Signup")}
          >
            Sign up
          </span>
        </h5>
      </form>
    </div>
  );
};

export default Login;
