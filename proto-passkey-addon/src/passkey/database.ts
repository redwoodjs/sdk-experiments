import { Kysely } from "kysely";
import { DODialect } from "kysely-do";
import { Migration } from "kysely";
import { createMigrator } from "../sdk";

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
      await db.schema
        .createTable("users")
        .addColumn("id", "text", (col) => col.primaryKey())
        .addColumn("username", "text", (col) => col.notNull().unique())
        .addColumn("createdAt", "text", (col) => col.notNull())
        .execute();

      await db.schema
        .createTable("credentials")
        .addColumn("id", "text", (col) => col.primaryKey())
        .addColumn("userId", "text", (col) => col.notNull())
        .addColumn("createdAt", "text", (col) => col.notNull())
        .addColumn("credentialId", "text", (col) => col.notNull().unique())
        .addColumn("publicKey", "blob", (col) => col.notNull())
        .addColumn("counter", "integer", (col) => col.notNull().defaultTo(0))
        .execute();

      await db.schema
        .createIndex("credentials_userId_idx")
        .on("credentials")
        .column("userId")
        .execute();

      await db.schema
        .createIndex("credentials_credentialId_idx")
        .on("credentials")
        .column("credentialId")
        .execute();

      // Add foreign key constraint
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
    },

    async down(db: Kysely<any>) {
      await db.schema.dropTable("credentials").execute();
      await db.schema.dropTable("users").execute();
    },
  },
};

// Static database functions for passkey auth
export function createDb(durableObjectState: any): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new DODialect({
      ctx: durableObjectState,
    }),
  });
}

export async function initializeDb(db: Kysely<Database>): Promise<void> {
  const migrator = createMigrator(db, migrations, "__passkey_migrations");
  const result = await migrator.migrateToLatest();
  if (result.error) {
    throw new Error(`Failed to run migrations: ${result.error}`);
  }
}

export async function createUser(
  db: Kysely<Database>,
  username: string
): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    username,
    createdAt: new Date().toISOString(),
  };

  await db.insertInto("users").values(user).execute();

  return user;
}

export async function getUserByUsername(
  db: Kysely<Database>,
  username: string
): Promise<User | null> {
  const result = await db
    .selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .executeTakeFirst();

  return result || null;
}

export async function createCredential(
  db: Kysely<Database>,
  credential: Omit<Credential, "id" | "createdAt">
): Promise<Credential> {
  const newCredential: Credential = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...credential,
  };

  await db.insertInto("credentials").values(newCredential).execute();

  return newCredential;
}

export async function getCredentialById(
  db: Kysely<Database>,
  credentialId: string
): Promise<Credential | null> {
  const result = await db
    .selectFrom("credentials")
    .selectAll()
    .where("credentialId", "=", credentialId)
    .executeTakeFirst();

  return result || null;
}

export async function updateCredentialCounter(
  db: Kysely<Database>,
  credentialId: string,
  counter: number
): Promise<void> {
  await db
    .updateTable("credentials")
    .set({ counter })
    .where("credentialId", "=", credentialId)
    .execute();
}

export async function getUserCredentials(
  db: Kysely<Database>,
  userId: string
): Promise<Credential[]> {
  return await db
    .selectFrom("credentials")
    .selectAll()
    .where("userId", "=", userId)
    .execute();
}
