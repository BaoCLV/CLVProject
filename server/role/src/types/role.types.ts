import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from 'src/entities/role.entity';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class RequestRole {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}