import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import GraphQLJSON from 'graphql-type-json'

@InputType()
export class CreateRequestDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  routeId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  requestType: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsObject()
  @IsOptional()
  proposedChanges?: Record<string, any>;  
}
