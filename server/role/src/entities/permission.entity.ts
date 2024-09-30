import { Directive, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum ClientPermission {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',

  CreateAnnouncement = 'permission.create.announcement',
  UpdateAnnouncement = 'permission.update.announcement',
}
registerEnumType(ClientPermission, {
  name: 'ClientPermission',
});


@ObjectType()
@Entity()
@Directive('@key(fields: "id")')
export class Permission {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ClientPermission)
  @Column({ unique: true })
  name: ClientPermission;
}