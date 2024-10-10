import { ObjectType, Field, Int, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsArray, IsUUID } from 'class-validator';
import { User } from '../../../nestjs/src/entities/user.entity';
import { ClientPermission } from 'src/enum/permissions.enum';

export enum ClientRole {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'Super Admin',
}

registerEnumType(ClientRole, {
  name: 'ClientRole',
});

@ObjectType()
export class RoleDto {
  @Field()
  id: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(ClientRole)
  name: ClientRole;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  rank: number;

  @Field(() => [User], { nullable: true })
  users: User[];

  @Field(() => [ClientPermission], { nullable: true })
  permissions: ClientPermission[];
}

@InputType()
export class CreateRoleDto {
  @Field()
  @IsNotEmpty()
  @IsEnum(ClientRole)
  name: ClientRole;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  rank: number;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}

@InputType()
export class UpdateRoleDto {
  @Field({ nullable: true })
  @IsEnum(ClientRole)
  name?: ClientRole;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  rank?: number;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}

@InputType()
export class UpdatePermissionDto {
  @Field({ nullable: true })
  @IsEnum(ClientPermission)
  name?: ClientPermission;
}
