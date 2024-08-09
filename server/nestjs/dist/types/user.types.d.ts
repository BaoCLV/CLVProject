import { User } from '../entities/user.entity';
export declare class ErrorType {
    message: string;
    code?: string;
}
export declare class RegisterResponse {
    activation_token: string;
    error?: ErrorType;
}
export declare class ActivationResponse {
    user: User | unknown;
    error?: ErrorType;
}
export declare class LoginResponse {
    user?: User | unknown;
    accessToken?: string;
    refreshToken?: string;
    error?: ErrorType;
}
export declare class LogOutResponse {
    message?: string;
}
