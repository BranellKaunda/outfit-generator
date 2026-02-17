import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
//import { usersTable } from "./db/schema";

import * as schema from "./db/schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });

/* async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };

  await db.insert(usersTable).values(user);
  console.log("New user created!");

  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);
 

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log("User info updated!");

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log("User deleted!");
} */

/*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */
//this should be inside main function
