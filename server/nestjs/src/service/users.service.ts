import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ActivationDto, LoginDto, RegisterDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterResponse, LoginResponse } from '../types/user.types';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
//mport { EmailService } from '../email/email.service';
import { TokenSender } from '../utils/sendToken';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
  address: string;
}

interface RoleService {
  getRoleById(data: { userId: string }): Observable<{ role: string}>;
}

@Injectable()
export class UsersService {
  activateUser(activationDto: ActivationDto, res: Response): import("../types/user.types").ActivationResponse | PromiseLike<import("../types/user.types").ActivationResponse> {
    throw new Error('Method not implemented.');
  }
  private roleService: RoleService;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    //private readonly emailService: EmailService,
  ) {}

  @GrpcMethod('UserService', 'Register')
  async register(registerDto: RegisterDto, res: Response): Promise<RegisterResponse> {
    const { name, email, password, phone_number, address } = registerDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    const existingPhone = await this.userRepository.findOne({ where: { phone_number } });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    if (existingPhone) {
      throw new BadRequestException('User with this phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
    });

    // Assign role via gRPC
    // const roleResponse = await this.roleService.getRoleById({ userId: user.name }).toPromise();
    // user.role = roleResponse.role || 'user'; // Default to 'user' if no role is provided

    // await this.userRepository.save(user);

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.ActivationCode;
    const activation_token = activationToken.Token;
    console.log(user)
    // await this.emailService.sendMail({
    //   email,
    //   subject: 'Activate your account!',
    //   template: 'activation-mail',
    //   name,
    //   ActivationCode: activationCode,
    // });

    return {
      activation_token,
    };
  }

  // Create activation token
  async createActivationToken(user: UserData) {
    const ActivationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const Token = this.jwtService.sign(
      {
        user,
        ActivationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '10m',
      },
    );
    return { Token, ActivationCode };
  }
  @GrpcMethod('UserService', 'Login')
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService, this.userRepository);
      console.log(user)
      return tokenSender.sendToken(user);
    } else {
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
  @GrpcMethod('UserService', 'GetLoggedInUser')
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    return { user, refreshToken, accessToken };
  }
  @GrpcMethod('UserService', 'Logout')
  async Logout(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accesstoken = null;
    return { message: 'Logged out successfully!' };
  }
  @GrpcMethod('UserService', 'GetUsers')
  async getUsers() {
    return this.userRepository.find({});
  }
}
