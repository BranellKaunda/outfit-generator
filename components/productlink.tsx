/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Clothing = {
  file?: string;
  type: "top" | "bottom" | "self";
  id?: string;
};

type ProductLinkProps = {
  self: Clothing[];
  setPasteUrl: (Url: string) => void;
  setImageIsGenerating: (isGenerating: boolean) => void;
};

export default function ProductLink({
  self,
  setPasteUrl,
  setImageIsGenerating,
}: ProductLinkProps) {
  const [url, setUrl] = useState("");
  const [imgUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const { data: session } = authClient.useSession();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  useEffect(() => {
    if (!url) return;

    const fetchImage = async () => {
      const response = await fetch("/api/extract-image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!data.ok) {
        setError(data.error);
        setImageUrl("");
        return;
      }

      setImageUrl(data.image);
      setError("");
    };

    fetchImage();
  }, [url]);

  const tryOnProduct = async () => {
    if (!imgUrl || !self[0]?.file) {
      alert("Product image and user image are required to try on.");
      return;
    }

    setImageIsGenerating(true);

    const res = await fetch("api/try-on", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        imgUrl,
        self: self[0]?.file,
        userId: session?.user?.id,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to try on product");
      setImageIsGenerating(false);
      return;
    }

    setImageIsGenerating(false);
    setPasteUrl(data.imageUrl);
    setError("");
  };

  return (
    <>
      <div className="try-on-container">
        <h2>Paste Outfit URL</h2>
        <p>
          Paste the url of outfit you want to try on. You will need to upload
          your user Image before proceeding.
        </p>

        <div>
          <input type="text" onChange={handleInput} />
        </div>

        <button onClick={tryOnProduct}>Try on</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="product">
          {imgUrl ? (
            <img src={imgUrl} alt="product" />
          ) : url ? (
            <p>Loading outfit...</p>
          ) : null}
        </div>
      </div>
    </>
  );
}
