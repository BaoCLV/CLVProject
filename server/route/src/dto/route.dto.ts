import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

@ObjectType()
export class RouteDto {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  startLocation: string;

  @Field()
  endLocation: string;

  @Field(() => Int)
  distance: number;
}

@InputType()
export class CreateRouteDto {
  @Field()
  @IsNotEmpty() // Ensures the field is not empty
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  startLocation: string; // Ensures start_location is provided and is a string

  @Field()
  @IsNotEmpty()
  @IsString()
  endLocation: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  distance: number;
}

@InputType()
export class UpdateRouteDto {
  @Field({ nullable: true })
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  startLocation?: string;

  @Field({ nullable: true })
  @IsString()
  endLocation?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  distance?: number;
}