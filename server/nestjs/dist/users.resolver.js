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
const response_dto_1 = require("./dto/response.dto");
const user_dto_1 = require("./dto/user.dto");
const user_entity_1 = require("./entities/user.entity");
let UsersResolver = class UsersResolver {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async users() {
        return this.usersService.getUser();
    }
    async register(registerDto) {
        return this.usersService.register(registerDto);
    }
    async login(loginDto) {
        return this.usersService.login(loginDto);
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
    (0, graphql_1.Mutation)(() => response_dto_1.RegisterResponse),
    __param(0, (0, graphql_1.Args)('registerDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "register", null);
__decorate([
    (0, graphql_1.Mutation)(() => response_dto_1.LoginResponse),
    __param(0, (0, graphql_1.Args)('loginDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "login", null);
exports.UsersResolver = UsersResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersResolver);
//# sourceMappingURL=users.resolver.js.map