import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  activation_token: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ActivationResponse {
  @Field(() => User)
  savedUser: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User | unknown;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LogOutResponse {
  @Field()
  message?: string;
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  forgotPasswordToken?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ResetPasswordResponse {
  @Field(() => User, { nullable: true })
  user?: User | unknown;
  
  @Field()
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class GetUserByEmailResponse {
  @Field(() => User)
  user?: User;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class UpdateUserResponse {
  @Field(() => User)
  user?: User | unknown;
  
  @Field()
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class UserListResponse {
  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class RequestChangePasswordResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  changePasswordToken?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ChangePasswordResponse {
  @Field(() => User, { nullable: true })
  user?: User | unknown;

  @Field({ nullable: true })
  updatedPassword?: string;
  
  @Field()
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
