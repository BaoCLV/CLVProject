"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const users_service_1 = require("./users.service");
const user_types_1 = require("./types/user.types");
const user_dto_1 = require("./dto/user.dto");
const user_entity_1 = require("./entities/user.entity");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("./guards/auth.guard");
let UsersResolver = class UsersResolver {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async users() {
        return this.usersService.getUsers();
    }
    async register(registerDto, context) {
        if (!registerDto.name || !registerDto.email || !registerDto.password) {
            throw new common_1.BadRequestException('Please fill the all fields');
        }
        const { activation_token } = await this.usersService.register(registerDto, context.res);
        return { activation_token };
    }
    async activateUser(activationDto, context) {
        return await this.usersService.activateUser(activationDto, context.res);
    }
    async login(email, password) {
        return await this.usersService.login({ email, password });
    }
    async getLoggedInUser(context) {
        return await this.usersService.getLoggedInUser(context.req);
    }
    async LogOutUser(context) {
        return await this.usersService.Logout(context.req);
    }
};
exports.UsersResolver = UsersResolver;
__decorate([
    (0, graphql_1.Query)(() => [user_entity_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "users", null);
__decorate([
    (0, graphql_1.Mutation)(() => user_types_1.RegisterResponse),
    __param(0, (0, graphql_1.Args)('registerDto')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "register", null);
__decorate([
    (0, graphql_1.Mutation)(() => user_types_1.ActivationResponse),
    __param(0, (0, graphql_1.Args)('activationDto')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.ActivationDto, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "activateUser", null);
__decorate([
    (0, graphql_1.Mutation)(() => user_types_1.LoginResponse),
    __param(0, (0, graphql_1.Args)('email')),
    __param(1, (0, graphql_1.Args)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Query)(() => user_types_1.LoginResponse),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getLoggedInUser", null);
__decorate([
    (0, graphql_1.Query)(() => user_types_1.LogOutResponse),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "LogOutUser", null);
exports.UsersResolver = UsersResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersResolver);
//# sourceMappingURL=users.resolver.js.map