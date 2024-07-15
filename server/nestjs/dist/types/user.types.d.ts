import { User } from '../entities/user.entity';
export declare class ErrorType {
    message: string;
    code?: string;
}
export declare class RegisterResponse {
    user?: User | any;
    error?: ErrorType;
}
export declare class LoginResponse {
    user?: User | any;
    accessToken?: string;
    refreshToken?: string;
    error?: ErrorType;
}
