import { ObjectType, Field, Int, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { User } from '../../../nestjs/src/entities/user.entity';
// import { ClientRole } from 'src/enum/role.enum';
import { ClientPermission } from 'src/enum/permissions.enum';

export enum ClientRole {
    User = 'user',
    Admin = 'admin',
}

registerEnumType(ClientRole, {
    name: 'ClientRole',
});

// @ObjectType()
// export class RoleDto {
//     @Field()
//     id: string;

//     @Field()
//     @IsNotEmpty()
//     @IsEnum(ClientRole)
//     name: ClientRole;

//     @Field()
//     @IsNotEmpty()
//     @IsNumber()
//     rank: number;

//     @Field()
//     user: User;

//     @Field()
//     permission: number;
// }

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
}

@InputType()
export class UpdateRoleDto {
    @Field({ nullable: true })
    @IsEnum(ClientRole)
    name?: ClientRole;

    @Field(() => Int, { nullable: true })
    @IsNumber()
    rank?: number;
}

@InputType()
export class CreatePermissionDto {
    @Field()
    @IsNotEmpty()
    @IsEnum(ClientPermission)
    name: ClientPermission;
}

@InputType()
export class UpdatePermissionDto {
    @Field({ nullable: true })
    @IsEnum(ClientPermission)
    name?: ClientPermission;
}