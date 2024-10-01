import styles from "../../../utils/styles";
import { ACTIVATE_USER } from "../../../graphql/auth/Actions/activation.action";
import { UPDATE_EMAIL } from "../../../graphql/auth/Actions/change-email.action"; // Assuming this is the mutation for email change
import { useMutation } from "@apollo/client";
import { FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useGraphQLClient } from "../../../hooks/useGraphql";

type Props = {
  setActiveState: (route: string) => void;
  isEmailChange?: boolean; // Add flag to differentiate between user activation and email verification
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ setActiveState, isEmailChange = false }) => {
  const authClient = useGraphQLClient("auth");

  // Use the correct mutation based on whether it's an email change or account activation
  const [ActivateUser, { loading: activateLoading }] = useMutation(ACTIVATE_USER, { client: authClient });
  const [UpdateEmail, { loading: emailLoading }] = useMutation(UPDATE_EMAIL, { client: authClient });

  const [invalidError, setInvalidError] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    const ActivationToken = localStorage.getItem("activation_token");

    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }

    const data = {
      ActivationToken,
      ActivationCode: verificationNumber,
    };

    try {
      if (isEmailChange) {
        // Handle email change verification
        await UpdateEmail({
          variables: data,
        });
        toast.success("Email changed successfully!");
        setActiveState("Complete"); // Transition to "Complete" state after email change
      } else {
        // Handle user account activation
        await ActivateUser({
          variables: data,
        });
        toast.success("Account activated successfully!");
        setActiveState("Login"); // Transition to login after account activation
      }

      localStorage.removeItem("activation_token");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Verify {isEmailChange ? "Your Email" : "Your Account"}</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-white justify-center text-[18px] font-Poppins outline-none text-center ${
              invalidError ? "shake border-red-500" : "border-white"
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center">
        <button
          className={`${styles.button}`}
          disabled={activateLoading || emailLoading} // Disable button during mutation
          onClick={verificationHandler}
        >
          {isEmailChange ? "Verify Email" : "Verify OTP"}
        </button>
      </div>
      <br />
      <h5 className="text-center pt-4 font-Poppins text-[14px] text-white">
        Go back to sign in?
        <span
          className="text-[#2190ff] pl-1 cursor-pointer"
          onClick={() => setActiveState("Login")}
        >
          Sign in
        </span>
      </h5>
    </div>
  );
};

export default Verification;
