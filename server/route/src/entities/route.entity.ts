import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Route {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  startLocation: string;

  @Field()
  @Column()
  endLocation: string;

  @Field(() => Float)
  @Column('float')
  distance: number;

  @Field(() => Float)
  @Column('float')
  price: number;

  @Field()
  @Column({ default: 'pending' })
  status: string;

  @Field()
  @Column('uuid')
  userId: string;  

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
