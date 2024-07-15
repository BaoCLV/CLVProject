export declare class RegisterDto {
    name: string;
    password: string;
    email: string;
    phone_number: number;
}
export declare class ActivationDto {
    activationToken: string;
    activationCode: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    password: string;
    activationToken: string;
}
