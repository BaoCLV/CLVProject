import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
@Entity()
export class Request {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column('uuid')
    userId: string;

    @Field()
    @Column()
    routeId: string;

    @Field()
    @Column()
    requestType: string; // 'update' or 'delete'

    @Field()
    @Column({ default: 'pending' })
    status: string; // 'pending', 'approved', 'rejected'

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Field()
    @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Field(() => GraphQLJSON, { nullable: true })
    @Column({ type: 'jsonb', nullable: true })
    proposedChanges?: Record<string, any>;  // store proposed changes
}
