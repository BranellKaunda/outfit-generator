"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useState } from "react";

export default function AvatarUploadPage({
  uploadCount,
  setUploadCount,
}: {
  uploadCount: number;
  setUploadCount: (count: number) => void;
}) {
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [typeOfClothing, setTypeOfClothing] = useState("");
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const hanldeFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectFile(file || null);
  };

  return (
    <>
      {/* <h1 className="upload-title">Upload</h1> */}

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!selectFile || !typeOfClothing) {
            /* throw new Error("No file selected"); */
            alert("Please select a file and category to upload.");
            setIsUploaded(false);
            return;
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
          setUploadCount(uploadCount + 1);
          setIsUploaded(true);
        }}
      >
        <label className="file-button">
          Choose File
          <input
            name="file"
            onChange={hanldeFileChange}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            required
          />
        </label>

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
        {isUploaded && (
          <p className="success-message">File uploaded successfully! </p>
        )}
      </form>
    </>
  );
}
