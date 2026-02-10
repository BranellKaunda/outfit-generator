/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import AvatarUploadPage from "@/components/upload";
import GenerateImage from "@/components/generate";

interface Clothing {
  file: string;
  type: "top" | "bottom" | "self";
  id: string;
}

export default function Home() {
  const [clothes, setClothes] = useState<Clothing[]>([]);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const fetchClothes = async () => {
      const response = await fetch("/api/clothes");
      const json = await response.json();
      setClothes(json.data);
      setIsFetched(true);
    };

    fetchClothes();
  }, []);

  const tops: Clothing[] = clothes?.filter((item) => item.type === "top");
  const bottoms: Clothing[] = clothes?.filter((item) => item.type === "bottom");
  const self: Clothing[] = clothes?.filter((item) => item.type === "self");

  const toggleTops = (
    images: Clothing[],
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const value = e.currentTarget.value;

    if (value === "+") {
      setTopIndex((prevIndex) => (prevIndex + 1) % images.length);
    } else {
      setTopIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1,
      );
    }
  };

  const toggleBottoms = (
    images: Clothing[],
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const value = e.currentTarget.value;

    if (value === "+") {
      setBottomIndex((prevIndex) => (prevIndex + 1) % images.length);
    } else {
      setBottomIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1,
      );
    }
  };

  if (!isFetched) {
    return <main>Loading...</main>;
  }

  return (
    <main>
      <h1>Outfit Generator</h1>
      <p>Welcome to the Outfit Generator app!</p>
      <div className="container">
        <div className="tops-wrapper">
          <button
            className="prev"
            value={"-"}
            onClick={(e) => toggleTops(tops, e)}
          >
            <img src={"/prev.png"} alt="prev arrow" />
          </button>

          <div className="top-img-div">
            {<img src={tops[topIndex]?.file} alt="top image" />}
          </div>

          <button
            className="next"
            value={"+"}
            onClick={(e) => toggleTops(tops, e)}
          >
            <img src={"/next.png"} alt="prev arrow" />
          </button>
        </div>

        <div className="bottom-wrapper">
          <button
            className="prev"
            value={"-"}
            onClick={(e) => toggleBottoms(bottoms, e)}
          >
            <img src={"/prev.png"} alt="prev arrow" />
          </button>

          <div className="bottom-img-div">
            {<img src={bottoms[bottomIndex]?.file} alt="bottom image" />}
          </div>

          <button
            className="next"
            value={"+"}
            onClick={(e) => toggleBottoms(bottoms, e)}
          >
            <img src={"/next.png"} alt="prev arrow" />
          </button>
        </div>
        <div className="self">
          {self &&
            self.map((me) => (
              <img key={me.id} src={me.file} alt="self image" />
            ))}
        </div>
      </div>

      {/* isFetched &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clothes.map((item: any) => (
          
          <img key={item.id} src={item.file} alt="Clothing item" />
        )) */}

      <AvatarUploadPage />
      <GenerateImage
        tops={tops[topIndex]?.file}
        bottom={bottoms[bottomIndex]?.file}
        self={self[0]?.file}
      />
    </main>
  );
}
