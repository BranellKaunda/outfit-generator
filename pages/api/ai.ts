// pages/api/ai.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    // Fetch the remote image
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    /* //try generating an image with the remote image as input
    const prompt = [
      { text: "Create a picture of a cat wearing the shirt" },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
    ];

    //tring to generate an image
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });
    if (imageResponse.candidates && imageResponse.candidates.length > 0) {
      const parts = imageResponse.candidates[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.text) {
            console.log(part.text);
          } else if (part.inlineData) {
            const imageData = part.inlineData.data;
            if (typeof imageData === "string") {
              const buffer = Buffer.from(imageData, "base64");
              fs.writeFileSync("gemini-native-image.png", buffer);
              console.log("Image saved as gemini-native-image.png");
            }
          }
        }
      }
    } */

    // Gemini 3 Flash request
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        { text: "Describe this image." },
      ],
    });

    return res.status(200).json({
      output: result.text,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("API ERROR:", err);
    return res.status(500).json({
      error: err.message ?? "Internal Server Error",
    });
  }
}

/* export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, imageUrls } = await req.json();

  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return res.json(
      { error: "imageUrls must be a non-empty array" },
      { status: 400 }
    );
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY!,
  });

  // Convert remote URLs → base64 inlineData
  const imageParts = await Promise.all(
    imageUrls.map(async (url) => {
      const res = await fetch(url);
      const buffer = Buffer.from(await res.arrayBuffer());
      return {
        inlineData: {
          mimeType: "image/png", // or detect dynamically
          data: buffer.toString("base64"),
        },
      };
    })
  );

  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    images: imageParts,
  });

  return res.json({
    output: result.text,
  });
} */
