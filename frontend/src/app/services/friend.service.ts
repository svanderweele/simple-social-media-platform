import axios from "axios";
import { toast } from "react-toastify";

const FRIENDS_HOST_URL = "http://localhost:3003";

export interface CreateFriendRequest {
  accountId: string;
  friendId: string;
}

export async function createFriendRequest(
  request: CreateFriendRequest,
  sessionToken:string
): Promise<void> {
  try {
    await axios({
      headers: { Authorization: `bearer ${sessionToken}` },
      baseURL: `${FRIENDS_HOST_URL}/friend-requests`,
      method: "post",
      data: request,
    });
  } catch (error) {
    console.error(error);
    toast.error("Failed to add friend. Check network tab for more info.");
  }
}

export interface CancelFriendRequest {
  friendId: string;
}
export async function cancelFriendRequest(
  request: CancelFriendRequest,
  sessionToken:string
): Promise<void> {
  try {
    await axios({
      headers: { Authorization: `bearer ${sessionToken}` },
      baseURL: `${FRIENDS_HOST_URL}/friend-requests`,
      method: "delete",
      data: { friendId: request.friendId },
    });
  } catch (error) {
    console.error(error);
    toast.error(
      "Failed to cancel friend request. Check network tab for more info."
    );
  }
}

export interface AcceptFriendRequest {
  friendId: string;
}

export async function acceptFriendRequest(
  request: AcceptFriendRequest,
  sessionToken:string
): Promise<void> {
  try {
    await axios({
      headers: { Authorization: `bearer ${sessionToken}` },
      baseURL: `${FRIENDS_HOST_URL}/friend-requests/accept`,
      method: "post",
      data: { friendId: request.friendId },
    });
  } catch (error) {
    console.error(error);
    toast.error(
      "Failed to accept friend request. Check network tab for more info."
    );
  }
}

export interface DeclineFriendRequest {
  friendId: string;
}

export async function declineFriendRequest(
  request: DeclineFriendRequest,
  sessionToken:string
): Promise<void> {
  try {
    await axios({
      headers: { Authorization: `bearer ${sessionToken}` },
      baseURL: `${FRIENDS_HOST_URL}/friend-requests/decline`,
      method: "post",
      data: { friendId: request.friendId },
    });
  } catch (error) {
    console.error(error);
    toast.error(
      "Failed to accept friend request. Check network tab for more info."
    );
  }
}

export interface FriendRequest {
  id: string;
  friendId: string;
  status: string;
  createdAt: string;
  accountId: string;
}

export async function getFriendRequests(sessionToken:string): Promise<FriendRequest[]> {
  try {
    const response = await axios({
      headers: { Authorization: `bearer ${sessionToken}` },
      baseURL: `${FRIENDS_HOST_URL}/friend-requests`,
      method: "get",
    });

    return response.data as FriendRequest[];
  } catch (error) {
    toast.error("Failed to add friend. Check network tab for more info.");
    console.error(error);
    return [];
  }
}

export async function getFriends(sessionToken:string): Promise<string[]> {
  try {
    const response = await axios({
      headers: { Authorization: `bearer ${sessionToken}` },
      baseURL: `${FRIENDS_HOST_URL}/friends`,
      method: "get",
    });

    return response.data;
  } catch (error) {
    toast.error("Failed to get friends. Check network tab for more info.");
    console.error(error);
    return [];
  }
}

export interface RemoveFriendRequest {
  accountId: string;
  friendId: string;
}

export async function removeFriend(
  request: RemoveFriendRequest,
  sessionToken:string
): Promise<void> {
  try {
    await axios({
      headers: { Authorization: `bearer ${sessionToken}` },
      baseURL: `${FRIENDS_HOST_URL}/friend-requests/remove`,
      method: "delete",
      data: { accountId: request.accountId, friendId: request.friendId },
    });
  } catch (error) {
    toast.error("Failed to remove friend. Check network tab for more info.");
    console.error(error);
  }
}
