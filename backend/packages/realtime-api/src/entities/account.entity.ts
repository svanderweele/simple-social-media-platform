import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RealtimeSession } from './realtime-session.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @OneToMany(() => RealtimeSession, (session) => session.account, {
    lazy: true,
  })
  realtimeSessions!: Promise<RealtimeSession[]>;
}
