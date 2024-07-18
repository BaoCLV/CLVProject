import { UsersService } from './users.service';
import { RegisterResponse, LoginResponse } from './dto/response.dto';
import { RegisterDto, LoginDto } from './dto/user.dto';
import { User } from './entities/user.entity';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    users(): Promise<User[]>;
    register(registerDto: RegisterDto): Promise<RegisterResponse>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
}
