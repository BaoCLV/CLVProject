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
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const users_service_1 = require("./users.service");
const user_types_1 = require("./types/user.types");
const user_dto_1 = require("./dto/user.dto");
const user_entity_1 = require("./entities/user.entity");
let UsersResolver = class UsersResolver {
    constructor(userService) {
        this.userService = userService;
    }
    async register(RegisterDto) {
        if (!RegisterDto.name || !RegisterDto.email || !RegisterDto.password) {
            throw new common_1.BadRequestException('Please enter all the field');
        }
        const user = await this.userService.register(RegisterDto);
        return { user };
    }
    async getUsers() {
        return this.userService.getUser();
    }
};
exports.UsersResolver = UsersResolver;
__decorate([
    (0, graphql_1.Mutation)(() => user_types_1.RegisterResponse),
    __param(0, (0, graphql_1.Args)('registerInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "register", null);
__decorate([
    (0, graphql_1.Query)(() => [user_entity_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUsers", null);
exports.UsersResolver = UsersResolver = __decorate([
    (0, graphql_1.Resolver)('User'),
    (0, common_1.UseFilters)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersResolver);
//# sourceMappingURL=users.resolver.js.map