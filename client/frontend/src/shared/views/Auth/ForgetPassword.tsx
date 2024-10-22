import styles from "../../../utils/styles";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD } from "../../../graphql/auth/Actions/forgot-password.action";
import { unauthClient } from "../../../graphql/auth/auth.gql.setup"
import { useRouter } from "next/navigation";


const formSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD, {
    client: unauthClient,
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      const response = await forgotPassword({
        variables: {
          email: data.email,
        },
      });
      //link to change password, should change it to email activation
      const nextUrl = response.data.forgotPassword.message;

      toast.success("Please check your email to reset your password!");
      reset();
    } catch (error: any) {
      console.error("GraphQL error:", error.graphQLErrors);
      console.error("Network error:", error.networkError);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Forgot your password?</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Enter your Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="email"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">
            {`${errors.email.message}`}
          </span>
        )}
        <br />
        <br />
        <input
          type="submit"
          value="Submit"
          disabled={isSubmitting || loading}
          className={`${styles.button} mt-3`}
        />
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Or Go Back to
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("Login")}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default ForgotPassword;