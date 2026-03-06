import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest): Promise<NextResponse> {
  const form = await request.formData();
  const file = form.get("file") as File;
  const type = form.get("type") as string;
  const userId = form.get("userId") as string;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json(
      { error: "request body is required" },
      { status: 400 },
    );
  }

  //const fields = await request.json();
  console.log("Received fields:", { file, type, userId });

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });

  //adding values to neon database tables
  await sql`
        INSERT INTO clothes (file, type, user_id)
        VALUES (${blob.url}, ${type}, ${userId})
      `;

  return NextResponse.json({ success: true, url: blob.url });
}
