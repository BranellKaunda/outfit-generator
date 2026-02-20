"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type LogInFormProps = {
  setAlreadyHaveAccount: (value: boolean) => void;
};

export default function LogInForm({ setAlreadyHaveAccount }: LogInFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
        rememberMe: true, // optional
      },
      {
        onRequest: () => {
          setIsLoading(true);
          setErrorMessage("");
        },
        onSuccess: () => {
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
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMessage ? <p className="error-message">{errorMessage}</p> : ""}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4">
          Dont have an account?{" "}
          <a
            className="text-blue-500 hover:underline"
            onClick={() => setAlreadyHaveAccount(false)}
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
