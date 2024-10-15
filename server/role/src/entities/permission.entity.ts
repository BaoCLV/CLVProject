import { Directive, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

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
  @PrimaryGeneratedColumn('uuid')  // Changed from regular id to UUID if required
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];  // Back reference to roles
}