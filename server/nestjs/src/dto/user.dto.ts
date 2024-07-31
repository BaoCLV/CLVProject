import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  phone_number: number;
  @Field()
  address: string;
}

@InputType()
export class ActivationDto{
  @Field()
  ActivationToken: string;

  @Field()
  ActivationCode: string;
}

@InputType()
export class LoginDto {
  @Field()
  email: string;

  @Field()
  password: string;
}
