"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_service_1 = require("./users.service");
const users_resolver_1 = require("./users.resolver");
const user_entity_1 = require("./entities/user.entity");
const config_1 = require("@nestjs/config");
const email_module_1 = require("./email/email.module");
const graphql_1 = require("@nestjs/graphql");
const jwt_1 = require("@nestjs/jwt");
const apollo_1 = require("@nestjs/apollo");
const email_service_1 = require("./email/email.service");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloFederationDriver,
                autoSchemaFile: {
                    federation: 2
                }
            }),
            email_module_1.EmailModule,
        ],
        providers: [
            users_service_1.UsersService,
            users_resolver_1.UsersResolver,
            config_1.ConfigService,
            jwt_1.JwtService,
            email_service_1.EmailService
        ],
        exports: [users_service_1.UsersService]
    })
], UsersModule);
//# sourceMappingURL=user.module.js.map