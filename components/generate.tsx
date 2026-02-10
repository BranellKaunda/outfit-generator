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

  /* const prompt = `
    You are an expert in Photoshop. Use the following file paths of a top and a bottom 
    to generate an image using the file path of a person wearing them: ${myUrls.join(", ")}.
    Make it as realistic as possible.
  `; */

  async function generate() {
    const imageUrls = [tops, bottom, self].filter(Boolean);
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
    <div>
      <button onClick={generate}>Generate Image</button>
      <p>{tops}</p>
      <p>{bottom}</p>
      <p>{self}</p>

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
