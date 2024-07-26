import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { FriendRequest } from './friend-request.entity';

@Entity()
export class Account {
  @PrimaryColumn('uuid')
  id!: string;

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.account)
  friendRequests!: Promise<FriendRequest[]>;
}
