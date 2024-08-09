export declare class RegisterDto {
    name: string;
    password: string;
    email: string;
    phone_number: number;
    address: string;
}
export declare class ActivationDto {
    ActivationToken: string;
    ActivationCode: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
