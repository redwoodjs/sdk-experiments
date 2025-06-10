import { Kysely } from "kysely";
import debug from "../../sdk/logger.js";
import { env } from "cloudflare:workers";

const log = debug("passkey:db");

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

export let db: Kysely<Database>;

export async function setupDb() {
  if (!env.PASSKEY_DURABLE_OBJECT) {
    throw new Error("PASSKEY_DURABLE_OBJECT binding not found in environment");
  }

  const durableObjectId = env.PASSKEY_DURABLE_OBJECT.idFromName("passkey-main");
  const durableObjectStub = env.PASSKEY_DURABLE_OBJECT.get(durableObjectId);
  db = await durableObjectStub.getDb();
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
