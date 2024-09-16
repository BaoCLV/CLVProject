"use client";
import styles from "../../../utils/styles";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGraphQLClient } from "../../../hooks/useGraphql";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "@/src/graphql/auth/Actions/reset-password.action";

// Define the form schema using Zod for validation
const formSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters long!"),
    confirmPassword: z.string(),
}).refine(
    (values) => {
        return values.password == values.confirmPassword
    },
    {
        message: "Confirm password must match your password!",
        path: ["confirmPassword"]
    }
)

    ;

// Define the form schema type
type ResetPAsswordSchema = z.infer<typeof formSchema>;

const ResetPassword = ({ activationToken }: { activationToken: string | string[] }) => {
    // Use authClient for authentication operations
    const authClient = useGraphQLClient("auth");

    // Initialize mutation with authClient
    const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, { client: authClient })
    // React Hook Form setup with Zod resolver for validation
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ResetPAsswordSchema>({
        resolver: zodResolver(formSchema),
    });

    const [show, setShow] = useState(false); // Toggle password visibility
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false)

    // Handle form submission
    const onSubmit = async (data: ResetPAsswordSchema) => {
        try {
            const response = await resetPassword({
                variables: {
                    password: data.password,
                    activationToken: activationToken
                }
            })
            toast.success("Password updated Successfully")
        } catch (error: any) {
            toast.error("Please fill in your mail again to reset your password")
        }
    };

    return (
        <div className="w-full flex justify-center items-center h-screen">
            <div className="md:w-[500px]">
                <h1 className={`${styles.title}`}>Reset Your Password</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                    <div className="w-full mt-5 relative mb-1">
                        <label htmlFor="password" className={`${styles.label}`}>
                            Confirm your password
                        </label>
                        <input
                            {...register("confirmPassword")}
                            type={confirmPasswordShow ? "text" : "password"}
                            placeholder="password"
                            className={`${styles.input}`}
                        />
                        {!confirmPasswordShow ? (
                            <AiOutlineEyeInvisible
                                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                                size={20}
                                onClick={() => setConfirmPasswordShow(true)}
                            />
                        ) : (
                            <AiOutlineEye
                                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                                size={20}
                                onClick={() => setConfirmPasswordShow(false)}
                            />
                        )}
                    </div>
                    {errors.confirmPassword && (
                        <span className="text-red-500">{errors.confirmPassword.message}</span>
                    )}
                    <br />
                    <input
                        type="submit"
                        value="Submit"
                        disabled={isSubmitting || loading}
                        className={`${styles.button} mt-3`}
                    />
                    <br />
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
