import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function checkDailyOutfitLimit(userId: string, limit: number) {
  const result = await sql`
    SELECT COUNT(*)::int AS count
    FROM outfits
    WHERE user_id = ${userId}
      AND created_at::date = CURRENT_DATE;
  `;

  const count = result[0].count;
  const remaining = limit - count;

  return {
    count,
    remaining,
    reached: count >= limit,
  };
}
