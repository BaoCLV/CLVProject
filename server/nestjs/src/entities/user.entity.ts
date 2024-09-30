import { ObjectType, Field } from '@nestjs/graphql';
import { Directive } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../../../role/src/entities/role.entity'
import { Permission } from '../../../role/src/entities/permission.entity'

@ObjectType()
@Entity()
@Directive('@key(fields: "id")')
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  // @Field()
  // @Column( {default: 'user'})
  // role: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone_number: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  refreshToken: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  role?: Role[];

  // Ability to also directly assign permissions to user
  // means more flexibility with potentially more complexity
  @ManyToMany(() => Permission)
  @JoinTable()
  permissions?: Permission[];

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
