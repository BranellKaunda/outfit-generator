/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";

export default function Outfits() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    // Fetch generated outfits from the backend API
    async function fetchOutfits() {
      try {
        const response = await fetch("/api/outfits");
        const data = await response.json();

        setOutfits(data);
      } catch (error) {
        console.error("Error fetching outfits:", error);
      }
    }

    fetchOutfits();
  }, []);

  return (
    <div className="outfits-wrapper">
      <h2>Outfits</h2>
      <div className="outfit-item">
        {/* outfits ? outfits.map((fit) => (<img src={}/>)) */}
        {outfits.length > 0 ? (
          outfits.map((fit, index) => (
            <div key={index} className="outfit">
              <img
                src={fit || "/placeholder.png"}
                alt={`Outfit ${index + 1}`}
              />
            </div>
          ))
        ) : (
          <p>No outfits generated yet.</p>
        )}
      </div>
    </div>
  );
}
