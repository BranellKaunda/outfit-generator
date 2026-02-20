"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type SignUpPageProps = {
  setAlreadyHaveAccount: (value: boolean) => void;
};

export default function SignUpPage({ setAlreadyHaveAccount }: SignUpPageProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          //router.push("../app");
          router.push("/");
        },
        onError: (ctx) => {
          setErrorMessage(ctx.error.message);
        },
      },
    );

    setIsLoading(false);
  };

  return (
    <div className="signup-container puff-in-center ">
      <h2>Create an account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a
            className="text-blue-500 hover:underline"
            onClick={() => setAlreadyHaveAccount(true)}
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
