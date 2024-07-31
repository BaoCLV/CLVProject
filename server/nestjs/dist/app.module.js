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
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user.module");
const user_entity_1 = require("./entities/user.entity");
const email_module_1 = require("./email/email.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const url = configService.get('DATABASE_URL');
                    return {
                        type: 'postgres',
                        url: url,
                        host: url ? undefined : configService.get('DB_HOST'),
                        port: url ? undefined : +configService.get('DB_PORT'),
                        username: url ? undefined : configService.get('DB_USER'),
                        password: url ? undefined : configService.get('DB_PASSWORD'),
                        database: url ? undefined : configService.get('DB_NAME'),
                        entities: [user_entity_1.User],
                        synchronize: true,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: true,
            }),
            user_module_1.UsersModule,
            email_module_1.EmailModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map