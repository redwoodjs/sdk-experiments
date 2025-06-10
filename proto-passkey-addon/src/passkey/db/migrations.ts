import { Kysely, Migration } from "kysely";
import debug from "@/sdk/logger.js";
import { Database } from "./db";

const log = debug("passkey:db:migrations");

export const migrations: Record<string, Migration> = {
  "001_initial_schema": {
    async up(db: Kysely<Database>) {
      log("Running migration: 001_initial_schema UP");

      log("Creating users table");
      await db.schema
        .createTable("users")
        .addColumn("id", "text", (col) => col.primaryKey())
        .addColumn("username", "text", (col) => col.notNull().unique())
        .addColumn("createdAt", "text", (col) => col.notNull())
        .execute();

      log("Creating credentials table");
      await db.schema
        .createTable("credentials")
        .addColumn("id", "text", (col) => col.primaryKey())
        .addColumn("userId", "text", (col) =>
          col.notNull().references("users.id").onDelete("cascade")
        )
        .addColumn("createdAt", "text", (col) => col.notNull())
        .addColumn("credentialId", "text", (col) => col.notNull().unique())
        .addColumn("publicKey", "blob", (col) => col.notNull())
        .addColumn("counter", "integer", (col) => col.notNull().defaultTo(0))
        .execute();

      log("Creating credentials_userId_idx index");
      await db.schema
        .createIndex("credentials_userId_idx")
        .on("credentials")
        .column("userId")
        .execute();

      log("Creating credentials_credentialId_idx index");
      await db.schema
        .createIndex("credentials_credentialId_idx")
        .on("credentials")
        .column("credentialId")
        .execute();

      log("Migration 001_initial_schema completed successfully");
    },

    async down(db: Kysely<Database>) {
      log("Running migration: 001_initial_schema DOWN");
      await db.schema.dropTable("credentials").execute();
      await db.schema.dropTable("users").execute();
      log("Migration 001_initial_schema rollback completed");
    },
  },
};
