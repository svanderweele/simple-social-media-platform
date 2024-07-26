import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @OneToOne(() => Account, (account) => account.user)
  account?: Account;
}
