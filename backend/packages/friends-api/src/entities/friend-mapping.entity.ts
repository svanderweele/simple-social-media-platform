import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { FriendRequest } from './friend-request.entity';

@Entity()
export class FriendMapping {
  @PrimaryColumn('uuid')
  accountId!: string;

  @PrimaryColumn('uuid')
  friendId!: string;

  @ManyToOne(() => FriendRequest, (source) => source.mapping)
  requestSource!: FriendRequest;
}
