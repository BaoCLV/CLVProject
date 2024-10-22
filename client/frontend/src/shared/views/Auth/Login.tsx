"use client";

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
import { useRouter } from "next/navigation";
import img from "next/image";

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
  const router = useRouter();
  const [login, { loading }] = useMutation(LOGIN_USER, { client: authClient });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const [show, setShow] = useState(false); // Toggle password visibility

  const onSubmit = async (data: LoginSchema) => {
    try {
      const loginData = { email: data.email, password: data.password };
      const response = await login({ variables: loginData });

      if (response.data.login.user) {
        toast.success("Login Successful!");
        Cookies.set("refresh_token", response.data.login.refreshToken);
        Cookies.set("access_token", response.data.login.accessToken);
        router.push("/");
        setOpen(false);
        reset();
        window.location.reload();
      } else {
        toast.error(response.data.login.error.message);
      }
    } catch (error) {
      toast.error("An error occurred during login.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl border-md">
      <div className="flex flex-col overflow-y-auto md:flex-row">
        {/* img Section */}
        <div className="h-32 md:h-auto w-1/2">
          <img
            aria-hidden="true"
            className="object-cover w-full h-full"
            src="/img/login-office.jpeg"
            alt="Office"
          />
        </div>

        {/* Form Section */}
        <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2 bg-white">
          <div className="w-full">
            <h1 className="mb-4 text-xl font-semibold text-black">Login</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="block text-sm">
                <span className="text-black">Email</span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className="block w-full mt-1 bg-white text-sm border-2 border-black p-3 text-lg transition duration-300 ease-in-out focus:border-blue-600 focus:outline-none"
                />
                {errors.email && (
                  <span className="text-red-500 block mt-1">
                    {errors.email.message}
                  </span>
                )}
              </label>

              <label className="block mt-4 text-sm">
                <span className="text-black">Password</span>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={show ? "text" : "password"}
                    placeholder="Enter your password"
                    className="block w-full mt-1 bg-white text-sm border-2 border-black p-3 text-lg transition duration-300 ease-in-out focus:border-blue-600 focus:outline-none"
                  />
                  {show ? (
                    <AiOutlineEye
                      className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                      onClick={() => setShow(false)}
                      size={24}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                      onClick={() => setShow(true)}
                      size={24}
                    />
                  )}
                </div>
                {errors.password && (
                  <span className="text-red-500 block mt-1">
                    {errors.password.message}
                  </span>
                )}
              </label>

              <div className="mt-4">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setActiveState("Forgot-Password")}
                >
                  Forgot your password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
              >
                Log in
              </button>

              <hr className="my-8" />

              <button
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-black transition-colors duration-150 border border-gray-300 rounded-lg hover:border-gray-500 focus:outline-none focus:shadow-outline-gray"
                onClick={() => signIn("google")}
              >
                <FcGoogle size={24} className="mr-2" />
                Sign in with Google
              </button>

              <div className="mt-4">
                <p className="text-sm text-center text-black">
                  Not have any account?
                  <a
                    href="#"
                    className="text-blue-600 hover:underline pl-1"
                    onClick={() => setActiveState("Signup")}
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
