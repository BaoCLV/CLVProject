import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Directive } from '@nestjs/graphql';

@ObjectType()
@Entity()
@Directive('@key(fields: "id")')
export class Route {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;
  
  @Field()
  @Column()
  startLocation: string;

  @Field()
  @Column()
  endLocation: string;

  @Field()
  @Column('float')
  distance: number;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
