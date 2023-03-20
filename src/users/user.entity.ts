import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

// enity class representing a user
@Entity()
export class User {
  // primary key
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

  // lifecycle hooks
  @AfterInsert()
  logInsert() {
    console.log('user created with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('user updated with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('user deleted with id', this.id);
  }
}
