"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const graphql_1 = require("@nestjs/graphql");
const app_service_1 = require("./app.service");
const apollo_1 = require("@nestjs/apollo");
const user_entity_1 = require("./entities/user.entity");
const gateway_1 = require("@apollo/gateway");
const user_module_1 = require("./user.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloGatewayDriver,
                gateway: {
                    supergraphSdl: new gateway_1.IntrospectAndCompose({
                        subgraphs: [
                            { name: 'users', url: 'http://localhost:3001/graphql' },
                        ],
                    }),
                },
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'db',
                port: 5432,
                username: 'postgres',
                password: 'password',
                database: 'CLVproject',
                entities: [user_entity_1.User],
                synchronize: true,
            }),
            user_module_1.UsersModule,
        ],
        controllers: [],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map