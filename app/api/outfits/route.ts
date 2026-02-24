import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    // Better Auth session using headers()
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const userId = session?.user.id;

    // Connect to Neon
    const sql = neon(process.env.DATABASE_URL!);

    // Fetch clothes belonging to this user
    const data = await sql`SELECT * FROM outfits WHERE user_id=${userId};`;

    return NextResponse.json(
      { message: "Fetched outfits", data },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching outfits:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
