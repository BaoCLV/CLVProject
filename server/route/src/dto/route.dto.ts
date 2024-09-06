import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType()
export class RouteDto {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  start_location: string;

  @Field()
  end_location: string;

  @Field(() => Int)
  distance: number;
}

@InputType()
export class CreateRouteDto {
  @Field()
  name: string;

  @Field()
  start_location: string;

  @Field()
  end_location: string;

  @Field(() => Int)
  distance: number;
}

@InputType()
export class UpdateRouteDto {
  @Field()
  name: string;

  @Field({ nullable: true })
  start_location?: string;

  @Field({ nullable: true })
  end_location?: string;

  @Field(() => Int, { nullable: true })
  distance?: number;
}
