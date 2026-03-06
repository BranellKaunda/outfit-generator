import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { checkDailyOutfitLimit } from "@/lib/outfitlimit";

const sql = neon(process.env.DATABASE_URL!);
const DAILY_OUTFIT_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    const { imageUrls, userId } = await req.json();

    if (!imageUrls || imageUrls.length !== 3) {
      return NextResponse.json(
        { error: "imageUrls must be an array of URLs" },
        { status: 400 },
      );
    }

    const limit = await checkDailyOutfitLimit(userId, DAILY_OUTFIT_LIMIT);

    if (limit.reached) {
      return NextResponse.json(
        {
          error: "Daily outfit limit reached",
          remaining: 0,
          limit: DAILY_OUTFIT_LIMIT,
        },
        { status: 403 },
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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

    const prompt = [
      {
        text: "You are an expert in Photoshop. Use the images of clothes provided of a top and a bottom to generate an image of the person wearing them. Make it as realistic as possible.",
      },
      ...inlineImages,
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    for (const part of result.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData || "", "base64");

        const prefix = `outfits/`;

        const blob = await put(`${prefix}gemini-native-image.png`, buffer, {
          access: "public",
          addRandomSuffix: true,
        });

        // Store the generated outfit URL in the database
        await sql`
          INSERT INTO outfits (files, user_id)
          VALUES (${[blob.url]}, ${userId})
        `;

        return NextResponse.json({ imageUrl: blob.url }, { status: 200 });
      }
    }

    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: (error as Error).message ?? "Internal Server Error" },
      { status: 500 },
    );
  }
}
