import { UsersService } from "./users.service";
import { RegisterResponse } from "./types/user.types";
import { RegisterDto } from "./dto/user.dto";
export declare class UsersResolver {
    private readonly userService;
    constructor(userService: UsersService);
    register(RegisterDto: RegisterDto): Promise<RegisterResponse>;
    getUsers(): Promise<any[]>;
}
