import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from './../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

class RedirectUnauthorizedException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
    this.message = 'redirect_to_home';
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const accessToken = req.headers.accesstoken as string;
    const refreshToken = req.headers.refreshtoken as string;

    if (!accessToken || !refreshToken) {
      throw new RedirectUnauthorizedException('Please login to access this resource!');
    }

    let decoded;
    try {
      decoded = this.jwtService.verify(accessToken, { secret: this.config.get('ACCESS_TOKEN_SECRET') });
    } catch (error) {
      throw new RedirectUnauthorizedException('Invalid access token');
    }

    const expirationTime = decoded?.exp;
    if (expirationTime * 1000 < Date.now()) {
      await this.updateAccessToken(req);
    }

    const user = await this.userRepo.findOne({ where: { id: decoded.id } });
    if (!user) {
      throw new RedirectUnauthorizedException('User not found');
    }

    req.user = user;

    return true;
  }

  private async updateAccessToken(req: any): Promise<void> {
    try {
      const refreshTokenData = req.headers.refreshtoken as string;
      const decoded = this.jwtService.decode(refreshTokenData);

      const expirationTime = decoded.exp * 1000;
      if (expirationTime < Date.now()) {
        throw new RedirectUnauthorizedException('Please login to access this resource!');
      }

      const user = await this.userRepo.findOne({
        where: {
          id: decoded.id,
        },
      });

      const accessToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '3d',
        },
      );

      const refreshToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      );

      req.accesstoken = accessToken;
      req.refreshtoken = refreshToken;
      req.user = user;
    } catch (error) {
      throw new RedirectUnauthorizedException(error.message);
    }
  }
}
