import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterResponse, LoginResponse, ErrorType } from './types/user.types';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';

interface UserData{
  name: string;
  email: string
  password: string;
  phone_number: number;
  address: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

async register(registerDto: RegisterDto, res: Response): Promise<RegisterResponse> {
    const { name, email, password, phone_number, address } = registerDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    const existingPhone = await this.userRepository.findOne({ where: { phone_number } });
    if (existingUser) {   
      throw new BadRequestException('user with this email already exist');
    }

    if (existingPhone) {
      throw new BadRequestException('user with this phone number already exist');
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

    const ActivationToken = await this.CreateActivationToken(user)

    const ActivationCode = ActivationToken.ActivationCode;

    const activation_token = ActivationToken.Token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: 'activation-mail',
      name,
      ActivationCode,
    });

    return {
      activation_token,
    };
  }



//create activation token
async CreateActivationToken(user: UserData){
  const ActivationCode = Math.floor(1000 + Math.random()* 9000).toString();

  const Token = this.jwtService.sign({
    user,
    ActivationCode,
  },{
    secret: this.configService.get<string>('ACTIVATION_SECRET'),
    expiresIn: '10m'
  })
  return {Token, ActivationCode};
}

//Activation User
async activateUser(activationDto: ActivationDto, response: Response) {
  const { ActivationToken, ActivationCode } = activationDto;

  const newUser = this.jwtService.verify<{ user: UserData; ActivationCode: string }>(
    ActivationToken,
    {
      secret: this.configService.get<string>('ACTIVATION_SECRET'),
    } as JwtVerifyOptions,
  );

  if (newUser.ActivationCode !== ActivationCode) {
    throw new BadRequestException('Invalid activation code');
  }

  const { name, email, password, phone_number, address } = newUser.user;

  // Check if the user already exists in the database
  const existingUser = await this.userRepository.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new BadRequestException('User already exists with this email!');
  }

  // Create the new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = this.userRepository.create({
    name,
    email,
    password: hashedPassword,
    phone_number,
    address,
  });

  await this.userRepository.save(user);

  return { user, response };
}

async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    console.log(user)
    if (user && (await bcrypt.compare(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService, this.userRepository);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid email or password',
        },
    }
  }
}
async getLoggedInUser(req: any) {
  const user = req.user;
  const refreshToken = req.refreshtoken;
  const accessToken = req.accesstoken;
  return { user, refreshToken, accessToken };
}

async Logout(req: any) {
  req.user = null;
  req.refreshtoken = null;
  req.accesstoken = null;
  return { message: 'Logged out successfully!' };
}

async getUsers() {
  return this.userRepository.find({});
}

}
