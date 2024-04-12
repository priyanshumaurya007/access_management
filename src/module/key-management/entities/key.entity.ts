import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: "keys"})
export class Key {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; // Change the type to string if it's alphanumeric

  @Column()
  key: string;

  @Column()
  rateLimit: number;

  @Column()
  expiration: Date;
}
