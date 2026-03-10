import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { ok: false, error: "missing url" },
        { status: 400 },
      );
    }

    const apiKey = process.env.SCRAPER_API_KEY;

    const scraperUrl = `https://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(
      url,
    )}&render=false`;

    const html = await fetch(scraperUrl).then((res) => res.text());

    const cheerio = await import("cheerio");
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

    if (image.startsWith("/")) {
      const base = new URL(url);
      image = `${base.origin}${image}`;
    }

    return NextResponse.json({ ok: true, image });
  } catch (err) {
    console.error("Error extracting image:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch product image" },
      { status: 500 },
    );
  }
}
