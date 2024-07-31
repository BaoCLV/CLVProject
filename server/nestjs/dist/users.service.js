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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const email_service_1 = require("./email/email.service");
const sendToken_1 = require("./utils/sendToken");
let UsersService = class UsersService {
    constructor(userRepository, configService, jwtService, emailService) {
        this.userRepository = userRepository;
        this.configService = configService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async register(registerDto, res) {
        const { name, email, password, phone_number, address } = registerDto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        const existingPhone = await this.userRepository.findOne({ where: { phone_number } });
        if (existingUser) {
            throw new common_1.BadRequestException('user with this email already exist');
        }
        if (existingPhone) {
            throw new common_1.BadRequestException('user with this phone number already exist');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            phone_number,
            address,
            role: 'user',
        });
        const ActivationToken = await this.CreateActivationToken(user);
        const ActivationCode = ActivationToken.ActivationCode;
        const activation_token = ActivationToken.Token;
        await this.emailService.sendMail({
            email,
            subject: 'Activate your account!',
            template: './activation-mail',
            name,
            ActivationCode,
        });
        return {
            activation_token,
        };
    }
    async CreateActivationToken(user) {
        const ActivationCode = Math.floor(1000 + Math.random() * 9000).toString();
        const Token = this.jwtService.sign({
            user,
            ActivationCode,
        }, {
            secret: this.configService.get('ACTIVATION_SECRET'),
            expiresIn: '10m'
        });
        return { Token, ActivationCode };
    }
    async activateUser(activationDto, response) {
        const { ActivationToken, ActivationCode } = activationDto;
        const newUser = this.jwtService.verify(ActivationToken, {
            secret: this.configService.get('ACTIVATION_SECRET'),
        });
        if (newUser.ActivationCode !== ActivationCode) {
            throw new common_1.BadRequestException('Invalid activation code');
        }
        const { name, email, password, phone_number } = newUser.user;
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists with this email!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            phone_number,
        });
        await this.userRepository.save(user);
        return { user, response };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const tokenSender = new sendToken_1.TokenSender(this.configService, this.jwtService, this.userRepository);
            return tokenSender.sendToken(user);
        }
        else {
            return {
                user: null,
                accessToken: null,
                refreshToken: null,
                error: {
                    message: 'Invalid email or password',
                },
            };
        }
    }
    async getLoggedInUser(req) {
        const user = req.user;
        const refreshToken = req.refreshtoken;
        const accessToken = req.accesstoken;
        return { user, refreshToken, accessToken };
    }
    async Logout(req) {
        req.user = null;
        req.refreshtoken = null;
        req.accesstoken = null;
        return { message: 'Logged out successfully!' };
    }
    async getUsers() {
        return this.userRepository.find({});
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], UsersService);
//# sourceMappingURL=users.service.js.map