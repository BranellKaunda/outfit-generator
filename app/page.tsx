/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import GenerateImage from "@/components/generate";
import SignUpPage from "../components/signup";
import UserInfo from "../components/userinfo";
import LogoutPage from "../components/logout";
import { authClient } from "@/lib/auth-client";
import LogInForm from "../components/login";
import UploadForm from "@/components/upload";

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
  const [url, setUrl] = useState(""); //generated imaged url sent as a prop to <generated/>
  const [imageIsGenerating, setImageIsGenerating] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const tops: Clothing[] = clothes?.filter((item) => item.type === "top");
  const bottoms: Clothing[] = clothes?.filter((item) => item.type === "bottom");
  const self: Clothing[] = clothes?.filter((item) => item.type === "self");

  useEffect(() => {
    if (!session) return;

    const fetchClothes = async () => {
      const response = await fetch("/api/clothes");

      if (response.status === 401) {
        setClothes([]);
        setIsFetched(true);
        return;
      }

      const json = await response.json();
      setClothes(json.data);
      setIsFetched(true);
    };

    fetchClothes();
  }, [uploadCount, session]); //re-renders when file successfully uploads.

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

  //create loading.tsx file for this
  if (isPending) {
    return (
      <main>
        <div className="loading">
          <img src="/loading.gif" alt="loading" />
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <>
        {!alreadyHaveAccount ? (
          <SignUpPage setAlreadyHaveAccount={setAlreadyHaveAccount} />
        ) : (
          <LogInForm setAlreadyHaveAccount={setAlreadyHaveAccount} />
        )}
      </>
    );
  }

  if (!isFetched) {
    return (
      <main>
        {" "}
        <div className="loading">
          {" "}
          <img src="/loading.gif" alt="loading clothes" />{" "}
        </div>{" "}
      </main>
    );
  }

  return (
    <main>
      <h1 className="app-name">Outfit Generator</h1>

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
              {tops?.[topIndex] ? (
                <img
                  src={tops?.[topIndex]?.file}
                  alt="top image"
                  key={tops?.[topIndex]?.id}
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
              {bottoms?.[bottomIndex] ? (
                <img
                  src={bottoms?.[bottomIndex]?.file}
                  alt="bottom image"
                  key={bottoms?.[bottomIndex]?.id}
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

          {/* if the image is generated, show generated imaged, or else show self image or default image*/}
          <div className="self-wrapper">
            <div>
              {imageIsGenerating ? (
                // 1. Loading state
                <img
                  src="/loading.gif"
                  alt="Generating..."
                  style={{
                    height: "16%",
                    width: "16%",
                  }}
                />
              ) : url ? (
                // 2. Generated AI image
                <img src={url} alt="Generated outfit" />
              ) : self?.[0] ? (
                // 3. Self image fallback
                <img key={self[0].id} src={self[0].file} alt="self image" />
              ) : (
                // 4. No image at all
                <img src="/no-img.png" alt="No self image available" />
              )}
            </div>
          </div>

          <UploadForm
            uploadCount={uploadCount}
            setUploadCount={setUploadCount}
          />
          {/*button / style me button*/}
          <GenerateImage
            tops={tops?.[topIndex]?.file}
            bottom={bottoms?.[bottomIndex]?.file}
            self={self?.[0]?.file}
            setUrl={setUrl}
            setImageIsGenerating={setImageIsGenerating}
          />
        </div>

        <LogoutPage />
      </>
    </main>
  );
}
