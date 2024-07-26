import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class RealtimeSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Account, (account) => account.realtimeSessions, {
    lazy: true,
  })
  account!: Promise<Account>;

  @CreateDateColumn()
  startedAt!: Date;

  @DeleteDateColumn()
  endedAt!: Date;
}
