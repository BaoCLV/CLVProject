import { ObjectType, Field, InputType, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

@ObjectType()
export class RouteDto {
  @Field(() => String)
  id: string;

  @Field()
  startLocation: string;

  @Field()
  endLocation: string;

  @Field(() => Float)
  distance: number;

  @Field(() => Float)  
  price: number;

  @Field()
  status: string;  

  @Field()
  userId: string;
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

  @Field(() => Float)  
  @IsNotEmpty()
  @IsNumber()
  price: number;  

  @Field(() => String, { defaultValue: 'pending' })
  @IsOptional()
  @IsString()
  status?: string;  

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

  @Field(() => Float, { nullable: true })
  @IsNumber()
  distance?: number;

  @Field(() => Float, { nullable: true }) 
  @IsNumber()
  price?: number;  
  @Field(() => String, { nullable: true })  
  @IsString()
  status?: string; 
}
