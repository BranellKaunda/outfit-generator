"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useState } from "react";

export default function AvatarUploadPage() {
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [typeOfClothing, setTypeOfClothing] = useState("");
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const hanldeFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectFile(file || null);
  };

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!selectFile) {
            throw new Error("No file selected");
          }

          const formData = new FormData();
          formData.append("file", selectFile);
          formData.append("type", typeOfClothing);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const newBlob = (await response.json()) as PutBlobResult;

          setBlob(newBlob);
        }}
      >
        <input
          name="file"
          onChange={hanldeFileChange}
          type="file"
          accept="image/jpeg, image/png, image/webp"
          required
        />
        <select
          name="category"
          required
          onChange={(e) => setTypeOfClothing(e.target.value)}
        >
          <option value="">Select category</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="self">Self</option>
        </select>
        <button type="submit">Upload</button>
      </form>
    </>
  );
}
