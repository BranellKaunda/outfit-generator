import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth-schema";

export * from "../auth-schema";

export const clothes = pgTable("clothes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  file: text("file").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clothesRelations = relations(clothes, ({ one }) => ({
  user: one(user, {
    fields: [clothes.userId],
    references: [user.id],
  }),
}));

// This table stores the profile pictures of the users
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  file: text("file").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(user, {
    fields: [profiles.userId],
    references: [user.id],
  }),
}));