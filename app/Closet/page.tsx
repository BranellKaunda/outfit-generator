/* eslint-disable @next/next/no-img-element */
"use client";

type Clothing = {
  file: string;
  type: "top" | "bottom" | "self";
  id: string;
};

export default function Closet({ clothes = [] }: { clothes?: Clothing[] }) {
  if (!clothes || clothes.length === 0) {
    return (
      <>
        <h2 className="closet-h2">Closet</h2>
        <div className="closet-msg">
          <p>Empty</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="closet-h2">Closet</h2>
      <div className="closet-wrapper">
        {clothes.map(
          (item) =>
            item.type !== "self" && (
              <div key={item.id} className="closet-item">
                <img
                  src={item.file}
                  alt={`${item.type} ${item.id}`}
                  className="closet-image"
                />
              </div>
            ),
        )}
      </div>
    </>
  );
}
