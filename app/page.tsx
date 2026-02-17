/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import AvatarUploadPage from "@/components/upload";
import GenerateImage from "@/components/generate";
import SignUpPage from "./signup/page";
import UserInfo from "./user/page";
import LogoutPage from "./logout/page";
import { authClient } from "@/lib/auth-client";
import LogInForm from "./login/page";

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
  const [uploadCount, setUploadCount] = useState(0);
  const [alreadyHaveAccount, setAlreadyHaveAccount] = useState(false);

  const tops: Clothing[] = clothes?.filter((item) => item.type === "top");
  const bottoms: Clothing[] = clothes?.filter((item) => item.type === "bottom");
  const self: Clothing[] = clothes?.filter((item) => item.type === "self");

  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchClothes = async () => {
      const response = await fetch("/api/clothes");
      const json = await response.json();
      setClothes(json.data);
      setIsFetched(true);
    };

    fetchClothes();
  }, [uploadCount]); //re-renders when file successfully uploads.

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
      <p>Plan your next outfit with ease!</p>

      {session ? (
        <>
          <UserInfo />
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
                {tops[topIndex] ? (
                  <img
                    src={tops[topIndex]?.file}
                    alt="top image"
                    key={tops[topIndex]?.id}
                  />
                ) : (
                  <img src="/no-img.png" alt="No top image available" />
                )}
                <h2>Tops</h2>
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
                {bottoms[bottomIndex] ? (
                  <img
                    src={bottoms[bottomIndex]?.file}
                    alt="bottom image"
                    key={bottoms[bottomIndex]?.id}
                  />
                ) : (
                  <img src="/no-img.png" alt="No bottom image available" />
                )}
                <h2>Bottoms</h2>
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
              {self[0] ? (
                <img key={self[0]?.id} src={self[0]?.file} alt="self image" />
              ) : (
                <img src="/no-img.png" alt="No self image available" />
              )}
            </div>

            <AvatarUploadPage
              uploadCount={uploadCount}
              setUploadCount={setUploadCount}
            />
            <GenerateImage
              tops={tops[topIndex]?.file}
              bottom={bottoms[bottomIndex]?.file}
              self={self[0]?.file}
            />
          </div>

          <LogoutPage />
        </>
      ) : !alreadyHaveAccount ? (
        <SignUpPage setAlreadyHaveAccount={setAlreadyHaveAccount} />
      ) : (
        <LogInForm setAlreadyHaveAccount={setAlreadyHaveAccount} />
      )}

      {/* <LogInForm /> */}
    </main>
  );
}
