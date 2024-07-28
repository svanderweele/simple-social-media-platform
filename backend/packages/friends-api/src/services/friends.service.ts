import { FriendRequestStatus, RealtimeTopic } from '@svdw/common';
import { SendRealtimeMessageProducer } from '../events/producers/send-realtime-message.producer';
import * as friendRepository from '../repository/friend.repository';
import { FriendRequestExistsError } from '../errors/friend-request-exists';
import { FriendRequestNotFoundError } from '../errors/friend-request-not-found';
import { FriendRequest } from '../entities/friend-request.entity';

export interface GetFriends {
  accountId: string;
}
export async function getFriends(request: GetFriends): Promise<string[]> {
  return await friendRepository.getFriends(request);
}

export interface GetPendingFriendRequests {
  accountId: string;
}

export async function getPendingFriendRequests(
  request: GetPendingFriendRequests,
): Promise<FriendRequest[]> {
  return await friendRepository.getPendingFriendRequests(request);
}

export interface SendFriendRequests {
  accountId: string;
}

export async function sendUserFriendRequests(
  request: SendFriendRequests,
): Promise<void> {
  const friendRequests =
    await friendRepository.getPendingFriendRequests(request);
  new SendRealtimeMessageProducer().publish({
    topic: RealtimeTopic.FriendRequests,
    accountId: request.accountId,
    message: friendRequests.map((request) => request.friendId),
  });
}

export interface AddFriendRequest {
  accountId: string;
  friendId: string;
}

export async function addFriendRequest(request: AddFriendRequest) {
  // Check for existing bidirectional request
  const existingRequest = await friendRepository.getFriendRequest(request);
  if (
    existingRequest &&
    existingRequest.status === FriendRequestStatus.Pending
  ) {
    throw new FriendRequestExistsError();
  } else {
    const existingRequest = await friendRepository.getFriendRequest({
      accountId: request.friendId,
      friendId: request.accountId,
    });
    if (
      existingRequest &&
      existingRequest.status === FriendRequestStatus.Pending
    ) {
      throw new FriendRequestExistsError();
    }
  }

  await friendRepository.createFriendRequest(request);

  // We don't await this because this operation is not critical
  sendUserFriendRequests(request);
}

export interface CancelFriendRequest {
  accountId: string;
  friendId: string;
}

export async function removeFriendRequest(request: CancelFriendRequest) {
  const existingRequest = await friendRepository.getFriendRequest(request);

  if (
    !existingRequest ||
    existingRequest.status != FriendRequestStatus.Pending
  ) {
    throw new FriendRequestNotFoundError();
  }

  await friendRepository.updateFriendRequestStatus({
    ...request,
    newStatus: FriendRequestStatus.Cancelled,
  });
}

export interface AcceptFriendRequest {
  accountId: string;
  friendId: string;
}

export async function acceptFriendRequest(request: AcceptFriendRequest) {
  const existingRequest = await friendRepository.getFriendRequest({
    accountId: request.friendId,
    friendId: request.accountId,
  });

  if (
    !existingRequest ||
    existingRequest.status != FriendRequestStatus.Pending
  ) {
    throw new FriendRequestNotFoundError();
  }

  await friendRepository.acceptFriendRequest({
    accountId: request.friendId,
    friendId: request.accountId,
  });
}

export interface DeclineFriendRequest {
  accountId: string;
  friendId: string;
}

export async function declineFriendRequest(request: DeclineFriendRequest) {
  const existingRequest = await friendRepository.getFriendRequest({
    accountId: request.friendId,
    friendId: request.accountId,
  });

  if (
    !existingRequest ||
    existingRequest.status != FriendRequestStatus.Pending
  ) {
    throw new FriendRequestNotFoundError();
  }

  await friendRepository.updateFriendRequestStatus({
    ...request,
    newStatus: FriendRequestStatus.Declined,
  });
}

export interface CreateAccountRequest {
  accountId: string;
}
export async function createAccount(request: CreateAccountRequest) {
  await friendRepository.createAccount(request);
}
