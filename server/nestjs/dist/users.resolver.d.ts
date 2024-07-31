import { UsersService } from './users.service';
import { RegisterResponse, LoginResponse, ActivationResponse } from './types/user.types';
import { RegisterDto, ActivationDto } from './dto/user.dto';
import { User } from './entities/user.entity';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    users(): Promise<User[]>;
    register(registerDto: RegisterDto, context: {
        res: Response;
    }): Promise<RegisterResponse>;
    activateUser(activationDto: ActivationDto, context: {
        res: Response;
    }): Promise<ActivationResponse>;
    login(email: string, password: string): Promise<LoginResponse>;
    getLoggedInUser(context: {
        req: Request;
    }): Promise<{
        user: any;
        refreshToken: any;
        accessToken: any;
    }>;
    LogOutUser(context: {
        req: Request;
    }): Promise<{
        message: string;
    }>;
}
