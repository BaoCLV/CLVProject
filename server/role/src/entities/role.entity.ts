import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../nestjs/src/entities/user.entity';
import { Permission } from './permission.entity';
import { Directive, Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

enum ClientRole {
  User = 'user',
  Admin = 'admin',
}
registerEnumType(ClientRole, {
  name: 'ClientRole',
});

@ObjectType()
@Entity()
@Directive('@key(fields: "id")')
export class Role {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ClientRole)
  @Column({ unique: true })
  name: ClientRole;

  @Field(() => Int)
  @Column({ type: 'integer', default: 999 })
  rank: number;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.role)
  users?: User[];

  @Field(() => [Permission], { nullable: true })
  @ManyToMany(() => Permission)
  @JoinTable()
  permissions?: Permission[];
}