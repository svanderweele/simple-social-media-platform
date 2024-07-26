import { DatabaseError, FriendRequestStatus } from '@svdw/common';
import { getDataSource } from './datasource';
import { FriendRequest } from '../entities/friend-request.entity';
import { FriendRequestNotFoundError } from '../errors/friend-request-not-found';
import { Account } from '../entities/account.entity';
import { AccountNotFoundError } from '../errors/account-not-found.error';
import { FriendRequestExistsError } from '../errors/friend-request-exists';
import { FriendMapping } from '../entities/friend-mapping.entity';
import { FriendMappingExistsError } from '../errors/friend-mapping-exists.error';

export interface GetFriendsRequest {
  accountId: string;
}

export async function getFriends(
  request: GetFriendsRequest,
): Promise<string[]> {
  const { accountId } = request;
  const repository = getDataSource().getRepository(FriendMapping);
  const mappings = await repository.find({ where: { accountId } });
  return mappings.map((x) => x.friendId);
}

export interface GetFriendRequestsRequest {
  accountId: string;
}

export async function getPendingFriendRequests(
  request: GetFriendRequestsRequest,
): Promise<FriendRequest[]> {
  const { accountId } = request;
  const repository = getDataSource().getRepository(FriendRequest);
  return await repository.find({
    where: [
      { accountId, status: FriendRequestStatus.Pending },
      { friendId: accountId, status: FriendRequestStatus.Pending },
    ],
  });
}

export interface CreateAccountRequest {
  accountId: string;
}

export async function createAccount(
  request: CreateAccountRequest,
): Promise<void> {
  const repository = getDataSource().getRepository(Account);
  await repository.save(repository.create({ id: request.accountId }));
}

export interface GetFriendRequest {
  accountId: string;
  friendId: string;
}

export async function getFriendRequest(
  request: CreateFriendRequest,
): Promise<FriendRequest | null> {
  const accountRepository = getDataSource().getRepository(Account);
  const account = await accountRepository.findOne({
    where: { id: request.accountId },
  });

  if (!account) {
    throw new AccountNotFoundError();
  }

  const friendRepository = getDataSource().getRepository(FriendRequest);
  return await friendRepository.findOneBy({
    friendId: request.friendId,
    account,
  });
}

export interface CreateFriendRequest {
  accountId: string;
  friendId: string;
}

export async function createFriendRequest(
  request: CreateFriendRequest,
): Promise<void> {
  const { accountId, friendId } = request;

  const friendRepository = getDataSource().getRepository(FriendRequest);
  const accountRepository = getDataSource().getRepository(Account);

  const account = await accountRepository.findOne({ where: { id: accountId } });

  if (!account) {
    throw new AccountNotFoundError();
  }

  const existingFriendRequest = await friendRepository.findOne({
    where: { account, friendId, status: FriendRequestStatus.Pending },
  });

  if (existingFriendRequest) {
    throw new FriendRequestExistsError();
  }

  try {
    await friendRepository.save(
      friendRepository.create({
        account,
        friendId,
        status: FriendRequestStatus.Pending,
      }),
    );
  } catch (error) {
    throw new DatabaseError(error);
  }
}

export interface UpdateFriendRequestStatus {
  accountId: string;
  friendId: string;
  newStatus: FriendRequestStatus;
}

export async function updateFriendRequestStatus(
  request: UpdateFriendRequestStatus,
): Promise<void> {
  const { accountId, friendId } = request;

  const friendRepository = getDataSource().getRepository(FriendRequest);
  const accountRepository = getDataSource().getRepository(Account);

  const account = await accountRepository.findOne({ where: { id: accountId } });

  if (!account) {
    throw new AccountNotFoundError();
  }

  const existingFriendRequest = await friendRepository.findOne({
    where: { account, friendId },
  });

  if (!existingFriendRequest) {
    throw new FriendRequestNotFoundError();
  }

  existingFriendRequest.status = request.newStatus;
  try {
    await friendRepository.save(existingFriendRequest);
  } catch (error) {
    throw new DatabaseError(error);
  }
}

export interface AcceptFriendRequest {
  accountId: string;
  friendId: string;
}

export async function acceptFriendRequest(
  request: AcceptFriendRequest,
): Promise<void> {
  const { accountId, friendId } = request;

  const friendMappingRepository = getDataSource().getRepository(FriendMapping);

  const friendRequest = await getFriendRequest({ accountId, friendId });

  if (!friendRequest) {
    throw new FriendRequestNotFoundError();
  }

  const existingMap = await friendMappingRepository.findOneBy({
    accountId,
    friendId,
  });

  if (existingMap) {
    throw new FriendMappingExistsError();
  }

  const queryRunner = getDataSource().createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const firstMap = friendMappingRepository.create({
      accountId: request.accountId,
      friendId: request.friendId,
      requestSource: friendRequest,
    });
    await queryRunner.manager.getRepository(FriendMapping).insert(firstMap);

    const secondMap = friendMappingRepository.create({
      accountId: request.friendId,
      friendId: request.accountId,
      requestSource: friendRequest,
    });
    await queryRunner.manager.getRepository(FriendMapping).insert(secondMap);

    friendRequest.status = FriendRequestStatus.Accepted;
    await queryRunner.manager.getRepository(FriendRequest).save(friendRequest);

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new DatabaseError(error);
  } finally {
    await queryRunner.release();
  }
}
