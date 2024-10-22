"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../../graphql/auth/Actions/register.action";
import toast from "react-hot-toast";
import { useGraphQLClient } from "../../../hooks/useGraphql";
import img from "next/image";

// Form schema for validation using Zod
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long!"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 characters!")
    .regex(/^\d+$/, "Phone number must contain only numbers!"),
  address: z.string(),
});

type SignUpSchema = z.infer<typeof formSchema>;

const Signup = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const authClient = useGraphQLClient("auth");
  const [registerUserMutation, { loading }] = useMutation(REGISTER_USER, {
    client: authClient,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(formSchema),
  });

  const [show, setShow] = useState(false); // Toggle password visibility

  const onSubmit = async (data: SignUpSchema) => {
    try {
      const response = await registerUserMutation({
        variables: data,
      });
      localStorage.setItem(
        "activation_token",
        response.data.register.activation_token
      );
      toast.success("Please check your email to activate your account!");
      reset();
      setActiveState("Verification");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center min-h-full p-6 bg-white">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl border-md">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          {/* img Section */}
          <div className="h-32 md:h-auto w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full"
              src="/img/login-office.jpeg"
              width={900} // Adjust to the actual width of the image
              height={1000} // Adjust to the actual height of the image
              alt="Office"
            />
          </div>

          {/* Form Section */}
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2 bg-white">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-black">
                Create an Account
              </h1>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name Input */}
                <label className="block text-sm">
                  <span className="text-black">Name</span>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Enter your name"
                    className="block w-full mt-1 bg-white text-lg border-black border-2 rounded-md p-4 transition duration-300 ease-in-out focus:border-blue-400 focus:outline-none"
                  />
                  {errors.name && (
                    <span className="text-red-500 block mt-1">
                      {errors.name.message}
                    </span>
                  )}
                </label>

                {/* Email Input */}
                <label className="block mt-4 text-sm">
                  <span className="text-black">Email</span>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className="block w-full mt-1 bg-white text-lg border-black border-2 rounded-md p-4 transition duration-300 ease-in-out focus:border-blue-400 focus:outline-none"
                  />
                  {errors.email && (
                    <span className="text-red-500 block mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </label>

                {/* Phone Number Input */}
                <label className="block mt-4 text-sm">
                  <span className="text-black">Phone Number</span>
                  <input
                    {...register("phone_number")}
                    type="text"
                    placeholder="Enter your phone number"
                    className="block w-full mt-1 bg-white text-lg border-black border-2 rounded-md p-4 transition duration-300 ease-in-out focus:border-blue-400 focus:outline-none"
                  />
                  {errors.phone_number && (
                    <span className="text-red-500 block mt-1">
                      {errors.phone_number.message}
                    </span>
                  )}
                </label>

                {/* Password Input */}
                <label className="block mt-4 text-sm">
                  <span className="text-black">Password</span>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={show ? "text" : "password"}
                      placeholder="Enter your password"
                      className="block w-full mt-1 bg-white text-lg border-black border-2 rounded-md p-4 transition duration-300 ease-in-out focus:border-blue-400 focus:outline-none"
                    />
                    {show ? (
                      <AiOutlineEye
                        className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                        onClick={() => setShow(false)}
                        size={20}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                        onClick={() => setShow(true)}
                        size={20}
                      />
                    )}
                  </div>
                  {errors.password && (
                    <span className="text-red-500 block mt-1">
                      {errors.password.message}
                    </span>
                  )}
                </label>

                {/* Address Input */}
                <label className="block mt-4 text-sm">
                  <span className="text-black">Address</span>
                  <input
                    {...register("address")}
                    type="text"
                    placeholder="Enter your address"
                    className="block w-full mt-1 bg-white text-lg border-black border-2 rounded-md p-4 transition duration-300 ease-in-out focus:border-blue-400 focus:outline-none"
                  />
                  {errors.address && (
                    <span className="text-red-500 block mt-1">
                      {errors.address.message}
                    </span>
                  )}
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="block w-full px-4 py-2 mt-6 text-sm font-medium leading-5 text-white bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                >
                  Sign Up
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-black">
                  Already have an account?
                  <a
                    href="#"
                    className="text-blue-600 hover:underline pl-1"
                    onClick={() => setActiveState("Login")}
                  >
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
