import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { RegisterResponse, LoginResponse } from './types/user.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';
interface UserData {
    name: string;
    email: string;
    password: string;
    phone_number: number;
}
export declare class UsersService {
    private readonly userRepository;
    private readonly configService;
    private readonly jwtService;
    private readonly emailService;
    constructor(userRepository: Repository<User>, configService: ConfigService, jwtService: JwtService, emailService: EmailService);
    register(registerDto: RegisterDto, res: Response): Promise<RegisterResponse>;
    CreateActivationToken(user: UserData): Promise<{
        Token: string;
        ActivationCode: string;
    }>;
    activateUser(activationDto: ActivationDto, response: Response): Promise<{
        user: User;
        response: Response;
    }>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
    getLoggedInUser(req: any): Promise<{
        user: any;
        refreshToken: any;
        accessToken: any;
    }>;
    Logout(req: any): Promise<{
        message: string;
    }>;
    getUsers(): Promise<User[]>;
}
export {};
