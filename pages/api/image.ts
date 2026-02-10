import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { imageUrls } = req.body;

    if (!imageUrls) {
      return res
        .status(400)
        .json({ error: "imageUrls must be an array of URLs" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // Convert all image URLs → base64 inlineData
    const inlineImages = await Promise.all(
      imageUrls.map(async (url: string) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        return {
          inlineData: {
            mimeType: "image/png",
            data: base64,
          },
        };
      }),
    );

    // Build the prompt with multiple images
    const prompt = [
      {
        text: "You are an expert in Photoshop. Use the images of clothes provided of a top and a bottom to generate an image of the person wearing them. Make it as realistic as possible.",
      },
      ...inlineImages, // spread all inlineData blocks
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    for (const part of result.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData: string = part.inlineData.data as string;
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync("./public/gemini-native-image.png", buffer);

        return res.status(200).json({ imageUrl: "/gemini-native-image.png" });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      error: error.message ?? "Internal Server Error",
    });
  }

  return res.status(500).json({ error: "Failed to generate image" });
}
