import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { checkDailyOutfitLimit } from "@/lib/outfitlimit";

const DAILY_OUTFIT_LIMIT = 2;

export async function POST(req: NextRequest) {
  try {
    const { imgUrl, self, userId } = await req.json();

    if (!imgUrl || !self || !userId) {
      return NextResponse.json(
        { ok: false, error: "Image URL and self image are required" },
        { status: 400 },
      );
    }

    const limit = await checkDailyOutfitLimit(userId, DAILY_OUTFIT_LIMIT);

    if (limit.reached) {
      return NextResponse.json(
        {
          ok: false,
          error: "Daily outfit limit reached",
          remaining: 0,
          limit: DAILY_OUTFIT_LIMIT,
        },
        { status: 403 },
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const inlineImages = await Promise.all(
      [imgUrl, self].map(async (url: string) => {
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
        text: "You are an expert in Photoshop. Use the image provided of a product from an external source to generate an image of the person wearing it. Make it as realistic as possible.",
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

        const prefix = `productOutfits/`;

        const blob = await put(`${prefix}gemini-native-image.png`, buffer, {
          access: "public",
          addRandomSuffix: true,
        });

        return NextResponse.json({
          ok: true,
          imageUrl: blob.url,
        });
      }
    }

    // If no inlineData was found
    return NextResponse.json(
      { ok: false, error: "No generated image returned by the model" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Error in try-on API:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "An error occurred while processing the try-on request",
      },
      { status: 500 },
    );
  }
}
