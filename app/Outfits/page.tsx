/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";

interface OutfitItem {
  id: string;
  files?: string[];
}

export default function Outfits({ url }: { url: string }) {
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const fetchOutfits = async () => {
      const response = await fetch("/api/outfits");

      if (response.status === 401) {
        // Handle unauthorized access, e.g., show a message or redirect
        setOutfits([]);
        setIsFetched(true);
        return;
      }

      const json = await response.json();
      //const data = json.data.map((item: OutfitItem) => item.files);
      setOutfits(json.data);
      setIsFetched(true);
    };

    fetchOutfits();
  }, [url]);

  if (!outfits || outfits.length === 0 || !isFetched) {
    return (
      <>
        <h2 className="outfits-h2">Outfits</h2>
        <div className="outfits-msg">
          <p>No outfits yet</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="outfits-h2">Outfits</h2>
      <div className="outfits-wrapper">
        {outfits.map((outfit, i) => (
          <img
            key={outfit.id}
            src={outfit.files?.[0]}
            alt={`Outfit ${i}`}
            className="outfit-image"
          />
        ))}
      </div>
    </>
  );
}
