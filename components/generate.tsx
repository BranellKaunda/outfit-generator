"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

interface GenerateImageProps {
  tops?: string;
  bottom?: string;
  self?: string;
  setUrl?: (value: string) => void;

  setImageIsGenerating?: (value: boolean) => void;
}

export default function GenerateImage({
  tops,
  bottom,
  self,
  setUrl,

  setImageIsGenerating,
}: GenerateImageProps) {
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const { data: session } = authClient.useSession();

  async function generate() {
    const imageUrls = [tops, bottom, self].filter(Boolean);

    if (imageUrls.length !== 3) {
      setImageIsGenerating?.(false);
      alert("Please upload images for top, bottom, and self before styling.");
      return;
    }

    setImageIsGenerating?.(true);

    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrls,
        userId: session?.user?.id,
      }),
    });

    if (res.status === 403) {
      setDailyLimitReached(true);
      setImageIsGenerating?.(false);
      return;
    }

    const data = await res.json();
    setImageIsGenerating?.(false);
    setDailyLimitReached(false);
    //image url returned from images.ts end point
    setUrl?.(data.imageUrl);
  }

  return (
    <div className="generate-wrapper">
      {dailyLimitReached && (
        <p className="limit-message">
          You have reached your daily outfit generation limit. Please try again
          tomorrow.
        </p>
      )}
      <button onClick={generate}>Style Me</button>
    </div>
  );
}
