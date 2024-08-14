import { BadRequestException, UseFilters } from "@nestjs/common";
import { Args, Query, Mutation ,Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { RegisterResponse } from "./types/user.types";
import { RegisterDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";



@Resolver('User')
@UseFilters()
export class UsersResolver {
    constructor (
        private readonly userService: UsersService
    ) {}

    @Mutation(() => RegisterResponse)
    async register(
        @Args('registerInput') RegisterDto: RegisterDto,
        //@Context() context: {res: Response},

    ): Promise<RegisterResponse> {
        if(!RegisterDto.name || !RegisterDto.email || !RegisterDto.password) {
            throw new BadRequestException('Please enter all the field');
        }

        const user = await this.userService.register(RegisterDto);

        return { user };
    }

    @Query(() => [User])
    async getUsers() {
        return this.userService.getUser();
    }
}