import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must need to be one string.' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email is invalid.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Phone Number is required.' })
  phone_number: string;

  @Field()
  @IsNotEmpty({ message: 'Address is required.' })
  address: string;
}

@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty({ message: 'Activation Token is required.' })
  ActivationToken: string;

  @Field()
  @IsNotEmpty({ message: 'Activation Code is required.' })
  ActivationCode: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}

@InputType()
export class ForgotPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required!' })
  @IsEmail({}, { message: 'Email must be valid!' })
  email: string
}

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Forgot Password Token is required.' })
  forgotPasswordToken: string;
}

@InputType()
export class RequestChangePasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  oldPassword: string;
}

@InputType()
export class ChangePasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  newPassword: string;

  @Field()
  @IsNotEmpty({ message: 'Change Password Token is required.' })
  changePasswordToken: string;
}

@InputType()
export class UpdateUserDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must need to be one string.' })
  name: string;

  @Field({ nullable: true })
  phone_number: string;

  @Field({ nullable: true })
  address: string;
}

@InputType()
export class ChangeEmailDto {
  @Field()
  @IsNotEmpty({ message: 'Old email is required.' })
  @IsEmail({}, { message: 'Old email must be a valid email address.' })
  oldEmail: string;

  @Field()
  @IsNotEmpty({ message: 'New email is required.' })
  @IsEmail({}, { message: 'New email must be a valid email address.' })
  newEmail: string;
}