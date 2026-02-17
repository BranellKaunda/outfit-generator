/* eslint-disable @next/next/no-img-element */
"use client";

interface Clothing {
  file: string;
  type: "top" | "bottom" | "self";
  id: string;
}

export default function Closet({ clothes }: { clothes: Clothing[] }) {
  return (
    <div className="closet-wrapper">
      <h2>Closet</h2>
      <div className="clothing-item">
        {clothes &&
          clothes.map((item) => (
            <img src={item.file} key={item.id} alt={`${item.type} item`} />
          ))}
      </div>
    </div>
  );
}
