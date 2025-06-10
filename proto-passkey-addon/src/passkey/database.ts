import { Kysely } from "kysely";
import { DODialect } from "kysely-do";
import { Migration } from "kysely";
import { createMigrator } from "../sdk";
import debug from "../sdk/logger.js";

const log = debug("passkey:database");

// Database schema types
export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface Credential {
  id: string;
  userId: string;
  createdAt: string;
  credentialId: string;
  publicKey: Uint8Array;
  counter: number;
}

export interface Database {
  users: User;
  credentials: Credential;
}

// Migrations
export const migrations: Record<string, Migration> = {
  "001_initial_schema": {
    async up(db: Kysely<any>) {
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
        .addColumn("userId", "text", (col) => col.notNull())
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

      // Add foreign key constraint
      log("Adding foreign key constraint");
      await db.schema
        .alterTable("credentials")
        .addForeignKeyConstraint(
          "credentials_userId_fkey",
          ["userId"],
          "users",
          ["id"]
        )
        .onDelete("cascade")
        .execute();

      log("Migration 001_initial_schema completed successfully");
    },

    async down(db: Kysely<any>) {
      log("Running migration: 001_initial_schema DOWN");
      await db.schema.dropTable("credentials").execute();
      await db.schema.dropTable("users").execute();
      log("Migration 001_initial_schema rollback completed");
    },
  },
};

// Static database functions for passkey auth
export function createDb(durableObjectState: any): Kysely<Database> {
  log("Creating database instance with DODialect");
  return new Kysely<Database>({
    dialect: new DODialect({
      ctx: durableObjectState,
    }),
  });
}

export async function initializeDb(db: Kysely<Database>): Promise<void> {
  log("Initializing database with migrations");
  const migrator = createMigrator(db, migrations, "__passkey_migrations");
  const result = await migrator.migrateToLatest();
  if (result.error) {
    log("ERROR: Migration failed: %o", result.error);
    throw new Error(`Failed to run migrations: ${result.error}`);
  }
  log("Database initialization completed successfully");
}

export async function createUser(
  db: Kysely<Database>,
  username: string
): Promise<User> {
  log("Creating user with username: %s", username);

  const user: User = {
    id: crypto.randomUUID(),
    username,
    createdAt: new Date().toISOString(),
  };

  log("Inserting user into database: %o", {
    id: user.id,
    username: user.username,
  });
  await db.insertInto("users").values(user).execute();

  log("User created successfully: %s", user.id);
  return user;
}

export async function getUserByUsername(
  db: Kysely<Database>,
  username: string
): Promise<User | null> {
  log("Looking up user by username: %s", username);

  const result = await db
    .selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .executeTakeFirst();

  log("User lookup result: %s", result ? "found" : "not found");
  return result || null;
}

export async function createCredential(
  db: Kysely<Database>,
  credential: Omit<Credential, "id" | "createdAt">
): Promise<Credential> {
  log("Creating credential for user: %s", credential.userId);

  const newCredential: Credential = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...credential,
  };

  log("Inserting credential into database: %o", {
    id: newCredential.id,
    userId: newCredential.userId,
    credentialId: newCredential.credentialId,
  });
  await db.insertInto("credentials").values(newCredential).execute();

  log("Credential created successfully: %s", newCredential.id);
  return newCredential;
}

export async function getCredentialById(
  db: Kysely<Database>,
  credentialId: string
): Promise<Credential | null> {
  log("Looking up credential by ID: %s", credentialId);

  const result = await db
    .selectFrom("credentials")
    .selectAll()
    .where("credentialId", "=", credentialId)
    .executeTakeFirst();

  log("Credential lookup result: %s", result ? "found" : "not found");
  return result || null;
}

export async function updateCredentialCounter(
  db: Kysely<Database>,
  credentialId: string,
  counter: number
): Promise<void> {
  log("Updating credential counter: %s -> %d", credentialId, counter);

  await db
    .updateTable("credentials")
    .set({ counter })
    .where("credentialId", "=", credentialId)
    .execute();

  log("Credential counter updated successfully");
}

export async function getUserCredentials(
  db: Kysely<Database>,
  userId: string
): Promise<Credential[]> {
  log("Getting all credentials for user: %s", userId);

  const credentials = await db
    .selectFrom("credentials")
    .selectAll()
    .where("userId", "=", userId)
    .execute();

  log("Found %d credentials for user: %s", credentials.length, userId);
  return credentials;
}
