import { ObjectType, Field } from '@nestjs/graphql';
import { Directive } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { Avatar } from './avatar.entity';

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

  // Role reference
  @Field(() => String)
  @Column({ type: 'uuid', nullable: true })
  roleId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone_number: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  refreshToken: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Field(() => Avatar, { nullable: true })
  @OneToOne(() => Avatar, avatar => avatar.user, { cascade: true, eager: true })
  avatar: Avatar;
}


