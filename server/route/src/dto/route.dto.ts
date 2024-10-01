import { ObjectType, Field, InputType, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';

@ObjectType()
export class RouteDto {
  @Field(() => String)
  id: string;

  @Field()
  startLocation: string;

  @Field()
  endLocation: string;

  @Field(() => Float) // Ensure distance is a Float
  distance: number;

  @Field()
  userId: string;  // Reference to the user who created the route
}

@InputType()
export class CreateRouteDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  startLocation: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  endLocation: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  distance: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

@InputType()
export class UpdateRouteDto {
  @Field({ nullable: true })
  @IsString()
  startLocation?: string;

  @Field({ nullable: true })
  @IsString()
  endLocation?: string;

  @Field(() => Float, { nullable: true }) // Change to Float for consistency
  @IsNumber()
  distance?: number;
}
