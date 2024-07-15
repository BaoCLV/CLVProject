import { LoginDto, RegisterDto } from './dto/user.dto';
export declare class UsersService {
    constructor();
    register(RegisterDto: RegisterDto): Promise<{
        name: string;
        email: string;
        password: string;
    }>;
    Login(LoginDto: LoginDto): Promise<{
        email: string;
        password: string;
    }>;
    getUser(): Promise<any[]>;
}
