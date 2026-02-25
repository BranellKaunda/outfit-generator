import { GoogleGenAI } from "@google/genai";
import { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { checkDailyOutfitLimit } from "@/lib/outfitlimit";

const sql = neon(process.env.DATABASE_URL!);
const DAILY_OUTFIT_LIMIT = 3;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { imageUrls, userId } = req.body;

    //do not generate image if there is a missing image url for top, bottom or self
    if (!imageUrls || imageUrls.length !== 3) {
      return res
        .status(400)
        .json({ error: "imageUrls must be an array of URLs" });
    }

    // Check if the user has reached their daily outfit generation limit
    const limit = await checkDailyOutfitLimit(userId, DAILY_OUTFIT_LIMIT);

    if (limit.reached) {
      return res.status(403).json({
        error: "Daily outfit limit reached",
        remaining: 0,
        limit: DAILY_OUTFIT_LIMIT,
      });
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
        const buffer = Buffer.from(imageData, "base64"); //image
        // fs.writeFileSync("./public/gemini-native-image.png", buffer);

        const prefix = `outfits/`;

        const blob = await put(`${prefix}gemini-native-image.png`, buffer, {
          access: "public",
          addRandomSuffix: true,
        });

        //adding values to neon database tables
        await sql`
        INSERT INTO outfits (files, user_id)
        VALUES (${[blob.url]}, ${userId})
      `;

        return res.status(200).json({ imageUrl: blob.url });
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
