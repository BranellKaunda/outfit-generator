"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const logOut = async () => {
    if (session) {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/"); // redirect to login page
          },
        },
      });
    }
  };

  return (
    <>
      <div className="logout">
        <button onClick={logOut}>Log out</button>
      </div>
    </>
  );
}
