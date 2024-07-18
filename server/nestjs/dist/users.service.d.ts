import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { RegisterResponse, LoginResponse } from './dto/response.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    register(registerDto: RegisterDto): Promise<RegisterResponse>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
    getUser(): Promise<User[]>;
}
