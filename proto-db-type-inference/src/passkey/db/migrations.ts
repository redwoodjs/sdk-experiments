import debug from "rwsdk/debug";
import type { Migrations } from "rwsdk/db";
export const log = debug("passkey:db:migrations");

export const migrations = {
  "001_initial_schema": {
    async up(db) {
      return [
        db.schema
          .createTable("users")
          .addColumn("id", "text", (col) => col.primaryKey())
          .addColumn("username", "text", (col) => col.notNull().unique())
          .addColumn("createdAt", "text", (col) => col.notNull())
          .execute(),

        db.schema
          .createTable("credentials")
          .addColumn("id", "text", (col) => col.primaryKey())
          .addColumn("userId", "text", (col) =>
            col.notNull().references("users.id").onDelete("cascade")
          )
          .addColumn("createdAt", "text", (col) => col.notNull())
          .addColumn("credentialId", "text", (col) => col.notNull().unique())
          .addColumn("publicKey", "blob", (col) => col.notNull())
          .addColumn("counter", "integer", (col) => col.notNull().defaultTo(0))
          .execute(),
      ];
    },

    async down(db) {
      return [
        await db.schema.dropTable("credentials").execute(),
        await db.schema.dropTable("users").execute(),
      ];
    },
  },
  "002_add_first_name": {
    async up(db) {
      return [
        db.schema
          .alterTable("users")
          .addColumn("firstName", "text", (col) => col.notNull().defaultTo(""))
          .execute(),
      ];
    },
  },
} satisfies Migrations;
