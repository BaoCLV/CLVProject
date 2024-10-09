import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Permission } from './permission.entity';


enum ClientRole {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'Super Admin'
}
registerEnumType(ClientRole, {
  name: 'ClientRole',
});


@ObjectType()
@Entity()
export class Role {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [Permission], { nullable: true })
  @ManyToMany(() => Permission)
  @JoinTable()
  permissions?: Permission[];

  
}
