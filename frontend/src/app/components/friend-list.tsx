"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { socket } from "@/app/utilities/socket";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  createFriendRequest,
  FriendRequest,
  getFriendRequests,
  getFriends,
  removeFriend,
} from "../services/friend.service";

const TEMP_ACCOUNT_ID = "a2fb248d-f725-44c0-aec2-e4cc3a9a4b5f";

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

type Person = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastSeen: string | null;
  lastSeenDateTime: string | null;
  isFriend: boolean;
  image?: string | undefined;
};

export default function FriendList() {
  const [users, setUsers] = useState<Person[]>([]);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<string[]>([]);

  const onUpdateFriendRequests = (pendingRequests: FriendRequest[]) => {
    setFriendRequests([...friendRequests, ...pendingRequests]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const friendRequests = await getFriendRequests();
      setFriendRequests(friendRequests);

      const startingUsers: Person[] = [
        {
          id: "5b9919d6-b4e4-4ddf-84ab-4ea7881c2c87",
          name: "Michael Foster",
          email: "michael.foster@example.com",
          role: "Co-Founder / CTO",
          lastSeen: "3h ago",
          lastSeenDateTime: "2023-01-23T13:23Z",
          isFriend: false,
        },
        {
          id: "a2fb248d-f725-44c0-aec2-e4cc3a9a4b5f",
          name: "Dries Vincent",
          email: "dries.vincent@example.com",
          role: "Business Relations",
          lastSeen: null,
          isFriend: false,
          lastSeenDateTime: null,
        },
        {
          id: "17df79e8-a0b6-4629-a8cc-381999d1cc65",
          name: "Lindsay Walton",
          email: "lindsay.walton@example.com",
          role: "Front-end Developer",
          lastSeen: "3h ago",
          lastSeenDateTime: "2023-01-23T13:23Z",
          isFriend: false,
        },
      ];
      setUsers(
        startingUsers.map((person) => {
          person.image = getUserImage(person.id);
          return person;
        })
      );

      const friends = await getFriends();
      setFriends(friends);

      friends.forEach((friendId) => {
        const user = startingUsers.find((user) => user.id === friendId);
        if (user) {
          user.isFriend = true;
        }
      });

      setUsers(startingUsers.filter((x) => x.id !== TEMP_ACCOUNT_ID));
    };

    fetchData();

    socket.on("friend-requests", onUpdateFriendRequests);

    return () => {
      socket.off("friend-requests", onUpdateFriendRequests);
    };
  }, []);

  useEffect(() => {
    if (
      friendRequests.filter((request) => request.friendId === TEMP_ACCOUNT_ID)
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
              <ShowFriendButton person={user} friendRequests={friendRequests} />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

async function onClickAcceptFriend(friendId: string) {
  await acceptFriendRequest({ friendId });
  //TODO: DISPATCH REDUX EVENT TO FETCH FRIENDS
}

function ShowFriendButton(props: {
  person: Person;
  friendRequests: FriendRequest[];
}) {
  const { person, friendRequests } = props;

  const friendRequest = friendRequests.find(
    (x) =>
      (x.friendId == person.id && x.accountId === TEMP_ACCOUNT_ID) ||
      (x.accountId == person.id && x.friendId === TEMP_ACCOUNT_ID)
  );

  if (friendRequest) {
    // If friend is the initiator
    if (friendRequest.friendId !== person.id) {
      return (
        <React.Fragment>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            <button
              onClick={async () => onClickAcceptFriend(person.id)}
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
              cancelFriendRequest({ friendId: friendRequest.friendId })
            }
            className="bg-gray-400 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
          >
            Friend Request Pending
          </button>
        </p>
      </React.Fragment>
    );
  }

  if (!person.isFriend) {
    return (
      <React.Fragment>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          <button
            onClick={async () =>
              createFriendRequest({
                accountId: TEMP_ACCOUNT_ID,
                friendId: person.id,
              })
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
              accountId: TEMP_ACCOUNT_ID,
              friendId: person.id,
            })
          }
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Unfriend
        </button>
      </p>
    </React.Fragment>
  );
}
