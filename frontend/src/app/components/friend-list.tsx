"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getSocket } from "@/app/utilities/socket";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  createFriendRequest,
  FriendRequest,
  getFriendRequests,
  getFriends,
  removeFriend,
} from "../services/friend.service";
import { getUsers, User } from "../services/user.service";
import { login, SessionData } from "../services/auth.service";


const imageUrls: string[] = [
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
];

const mappedImages: Record<string, string> = {};

const getUserImage = (id: string): string => {
  if (!mappedImages[id]) {
    mappedImages[id] = imageUrls.pop() as string;
  }

  return mappedImages[id];
};


export default function FriendList() {
  const [email, setEmail] = useState("ricky@gmail.com")
  const [sessionData, setSessionData] = useState<SessionData>({accountId:"", sessionToken:"", userId:""});
  const [users, setUsers] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<string[]>([]);

  const onUpdateFriendRequests = (pendingRequests: FriendRequest[]) => {
    const newFriendRequests = [...friendRequests, ...pendingRequests];
    setFriendRequests(pendingRequests);
    console.log("Update friend requests ", sessionData, newFriendRequests);
  };

  const loginToUser = async () => {
    const sessionData = await login({username:email, password:"SomeAwesomePa$$work123"});
    setSessionData(sessionData);
  }

  const fetchData = async () => {
    const friendRequests = await getFriendRequests(sessionData.sessionToken);
    onUpdateFriendRequests(friendRequests);
    // setFriendRequests(friendRequests);
    
  const users = await getUsers(sessionData.sessionToken); 

    setUsers(
      users.map((user) => {
        user.image = getUserImage(user.accountId);
        return user;
      })
    );

    const friends = await getFriends(sessionData.sessionToken);
    setFriends(friends);

    friends.forEach((friendId) => {
      const user = users.find((user) => user.accountId === friendId);
      if (user) {
        user.isFriend = true;
      }
    });

    setUsers(users.filter((x) => x.accountId !== sessionData.accountId));

    const socket = getSocket(sessionData?.sessionToken);

    socket.on("friend-requests", onUpdateFriendRequests);

    return () => {
      socket.off("friend-requests", onUpdateFriendRequests);
    };
  };


  useEffect(() => {
    loginToUser();
  },[]);

  useEffect(() => {
    fetchData();
  }, [sessionData]);

  useEffect(() => {
    if (
      friendRequests.filter((request) => request.friendId === sessionData.accountId)
        .length > 0
    ) {
      toast(`🦄 You have ${friendRequests.length}  new friend requests`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }, [friendRequests]);

  return (
    <React.Fragment>
    <ul role="list" className="divide-y divide-gray-100">
      {users.map((user) => (
        <li key={user.email} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <Image
              alt=""
              src={user.image!}
              width={50}
              height={50}
              className="h-12 w-12 flex-none rounded-full bg-gray-50"
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {user.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {user.email}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            {user.isFriend ? (
              <p className="mt-1 text-xs leading-5 text-gray-500">
                <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded">
                  See Profile
                </button>
              </p>
            ) : (
              <ShowFriendButton sessionData={sessionData} user={user} friendRequests={friendRequests} />
            )}
          </div>
        </li>
      ))}

        <input
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        />
        <button onClick={() => loginToUser()}>Login</button>
    </ul>
    </React.Fragment>
  );
}

async function onClickAcceptFriend(friendId: string, sessionToken:string) {
  await acceptFriendRequest({ friendId}, sessionToken);
  //TODO: DISPATCH REDUX EVENT TO FETCH FRIENDS
}



function ShowFriendButton(props: {
  sessionData: SessionData,
  user: User;
  friendRequests: FriendRequest[];
}) {
  const { user, friendRequests, sessionData } = props;

  const friendRequest = friendRequests.find(
    (x) =>
      (x.friendId == user.accountId && x.accountId === sessionData.accountId) ||
      (x.accountId == user.accountId && x.friendId === sessionData.accountId)
  );

  if (friendRequest) {
    // If friend is the initiator
    if (friendRequest.friendId !== user.accountId) {
      return (
        <React.Fragment>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            <button
              onClick={async () => onClickAcceptFriend(user.accountId, sessionData.sessionToken)}
              className="bg-emerald-400 hover:bg-emerald-700 text-white font-bold py-1 px-2 rounded"
            >
              Accept Friend
            </button>
          </p>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          <button
            onClick={async () =>
              cancelFriendRequest({ friendId: friendRequest.friendId },sessionData.sessionToken)
            }
            className="bg-gray-400 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
          >
            Friend Request Pending
          </button>
        </p>
      </React.Fragment>
    );
  }

  if (!user.isFriend) {
    return (
      <React.Fragment>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          <button
            onClick={async () =>
              createFriendRequest({
                accountId: sessionData.accountId,
                friendId: user.accountId,
              }, sessionData.sessionToken)
            }
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          >
            Add Friend
          </button>
        </p>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <p className="mt-1 text-xs leading-5 text-gray-500">
        <button
          onClick={async () =>
            removeFriend({
              accountId: sessionData.accountId,
              friendId: user.accountId,
            }, sessionData.sessionToken)
          }
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Unfriend
        </button>
      </p>
    </React.Fragment>
  );
}
