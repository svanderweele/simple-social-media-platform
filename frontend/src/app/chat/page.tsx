"use client";
import FriendList from "../components/friend-list";
import ToastContainerWrapper from "../components/toastify-wrapper";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <FriendList></FriendList>
    </main>
  );
}
