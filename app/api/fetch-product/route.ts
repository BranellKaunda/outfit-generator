import { NextResponse, NextRequest } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { ok: false, error: "missing url" },
        { status: 400 },
      );
    }

    const html = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    }).then((res) => res.text());

    const $ = cheerio.load(html);

    let image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $("img").first().attr("src");

    if (!image) {
      return NextResponse.json(
        { ok: false, error: "no image found" },
        { status: 404 },
      );
    }

    if (image.startsWith("//")) {
      const base = new URL(url);
      image = `${base.origin}${image}`;
    }

    return NextResponse.json({ ok: true, image });
  } catch (error) {
    console.error("Error fetching product image:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch product image" },
      { status: 500 },
    );
  }
}
