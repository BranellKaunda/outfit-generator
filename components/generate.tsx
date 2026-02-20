/* eslint-disable @next/next/no-img-element */
"use client";

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
      }),
    });

    const data = await res.json();
    setImageIsGenerating?.(false);
    //image url returned from images.ts end point
    setUrl?.(data.imageUrl);
  }

  return (
    <div className="generate-wrapper">
      <button onClick={generate}>Style Me</button>
    </div>
  );
}
