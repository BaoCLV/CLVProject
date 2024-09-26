import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { UserPermission } from '../../src/enum/permissions.enum';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: String;
}
