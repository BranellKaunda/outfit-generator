/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

interface GenerateImageProps {
  tops?: string;
  bottom?: string;
  self?: string;
}

export default function GenerateImage({
  tops,
  bottom,
  self,
}: GenerateImageProps) {
  const [url, setUrl] = useState("");

  async function generate() {
    const imageUrls = [tops, bottom, self].filter(Boolean);

    if (imageUrls.length !== 3) {
      alert("Please upload images for top, bottom, and self before styling.");
      return;
    }

    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrls,
      }),
    });

    const data = await res.json();
    //image url returned from images.ts end point
    setUrl(data.imageUrl);
    console.log(data);
  }

  return (
    <div className="generate-wrapper">
      <button onClick={generate}>Style Me</button>

      {url && (
        <img
          src={url}
          alt="Generated"
          style={{ marginTop: "20px", maxWidth: "400px" }}
        />
      )}
    </div>
  );
}
