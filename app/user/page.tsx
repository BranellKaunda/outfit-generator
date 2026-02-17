"use client";

import { authClient } from "@/lib/auth-client";

export default function UserInfo() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  return (
    <div className="user-info">
      <h2>Welcome, {session.user.name}</h2>
    </div>
  );
}
