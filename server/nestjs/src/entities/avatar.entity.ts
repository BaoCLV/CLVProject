import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Avatar {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Store the binary image data in the database
  @Column({ type: 'bytea', nullable: true }) // Use 'blob' for MySQL
  private imageData: Buffer;  // Keep the image data private

  @Field({ nullable: true })
  get imageDataBase64(): string {
    // Convert binary data to base64 string for GraphQL response
    return this.imageData ? this.imageData.toString('base64') : null;
  }

  // Create a setter for imageData to handle base64-to-buffer conversion
  set imageDataBase64(base64Image: string) {
    this.imageData = Buffer.from(base64Image, 'base64');
  }

  @Field()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.avatar, { onDelete: 'CASCADE' })
  user: User;
}
