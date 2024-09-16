import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ActivationDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterResponse, LoginResponse } from '../types/user.types';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenSender } from '../utils/sendToken';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
  address: string;
}

interface RoleService {
  getRoleById(data: { userId: string }): Observable<{ role: string }>;
}

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly kafkaProducerService: KafkaProducerService,
    // private readonly emailService: EmailService,
  ) { }

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



    // Assign role via gRPC
    // const roleResponse = await this.roleService.getRoleById({ userId: user.name }).toPromise();
    // user.role = roleResponse.role || 'user'; // Default to 'user' if no role is provided
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = ({
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
    });

    const activationToken = await this.createActivationToken(user);

    await this.kafkaProducerService.sendUserRegisteredEvent({
      email: user.email,
      name: user.name,
      activation_token: activationToken.Token, // Send the token
      activation_code: activationToken.ActivationCode,
    });
    // const activationCode = activationToken.ActivationCode;
    const activation_token = activationToken.Token;

    return {
      activation_token,
    };
  }
  //activate user
  async activateUser(activationDto: ActivationDto, response: Response){
    const {ActivationToken, ActivationCode } = activationDto;

    const newUser: {user: UserData; ActivationCode: string} =
      this.jwtService.verify(ActivationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      } as JwtVerifyOptions) as {user:UserData; ActivationCode: string};
      if (newUser.ActivationCode !== ActivationCode) {
        throw new BadRequestException('Invalid activation code');
      }
  
      const { name, email, password, phone_number, address } = newUser.user;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        phone_number,
        address,
      });

      const savedUser = await this.userRepository.save(user);
      console.log(savedUser)
      return { savedUser, response };
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
    return {
      Token,
      ActivationCode 
    };
  }
  @GrpcMethod('UserService', 'Login')
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await this.comparePassword(password, user.password))
    ) {
      const tokenSender = new TokenSender(this.configService, this.jwtService, this.userRepository);
      console.log(user)
      return tokenSender.sendToken(user);
    } else {
      console.log(password);
      console.log(user.password)
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
 
async comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
    console.log('Comparing:', password, hashedPassword);

    return await  bcrypt.compare(password, hashedPassword);
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

  //Gernerate forgot password link
  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        user,
      },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m'
      },
    );
    return forgotPasswordToken;
  }

  //Forgot password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException("User is not found!")
    }

    const forgotPasswordToken = await this.generateForgotPasswordLink(user)
    const resetPasswordUrl =
      this.configService.get<string>('CLIENT_SIDE_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;

    // await this.emailService.sendMail({
    //   email,
    //   subject: 'Reset your Password!',
    //   template: './forgot-password',
    //   name: user.name,
    //   ActivationCode: resetPasswordUrl,
    // });
    return { message: `Your forgot password request succesful at ${resetPasswordUrl}` };
  }

  //reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;
  
    const decoded = await this.jwtService.decode(activationToken);
  
    if (!decoded || decoded?.exp * 1000 < Date.now()) {
      throw new BadRequestException('Invalid token!');
    }
  
    // const hashedPassword = await bcrypt.hash(password, 10);
  
    await this.userRepository.update(
      { id: decoded.user.id },
      { password: password }
    );
  
    // Fetch the updated user
    const user = await this.userRepository.findOne({ where: { id: decoded.user.id } });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    return { user };
  }
}
