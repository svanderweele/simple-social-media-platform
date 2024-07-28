import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { FriendRequestStatus } from '@svdw/common';
import { FriendMapping } from './friend-mapping.entity';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  friendId!: string;

  @Column('varchar')
  status!: FriendRequestStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Account, (account) => account.friendRequests)
  @JoinColumn()
  account!: Account;

  @Column('uuid')
  accountId!: string;

  @OneToMany(() => FriendMapping, (request) => request.requestSource)
  mapping!: FriendMapping[];
}
