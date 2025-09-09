import { type Migrations } from "rwsdk/db";

export const migrations = {
  "001_initial_schema": {
    async up(db) {
      return [
        await db.schema
          .createTable("users")
          .addColumn("id", "text", (col) => col.primaryKey())
          .addColumn("username", "text", (col) => col.notNull().unique())
          .execute(),
        await db.schema
          .createTable("posts")
          .addColumn("id", "text", (col) => col.primaryKey())
          .addColumn("userId", "text", (col) => col.notNull().references("users.id"))
          .addColumn("title", "text", (col) => col.notNull())
          .addColumn("content", "text")
          .execute(), 
      ];
    },
  },
} satisfies Migrations;
