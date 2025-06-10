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

export async function createUser(username: string): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    username,
    createdAt: new Date().toISOString(),
  };

  await db.insertInto("users").values(user).execute();

  return user;
}

export async function getUserById(id: string): Promise<User | undefined> {
  return await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function createCredential(
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
  credentialId: string
): Promise<Credential | undefined> {
  return await db
    .selectFrom("credentials")
    .selectAll()
    .where("credentialId", "=", credentialId)
    .executeTakeFirst();
}

export async function updateCredentialCounter(
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
  userId: string
): Promise<Credential[]> {
  return await db
    .selectFrom("credentials")
    .selectAll()
    .where("userId", "=", userId)
    .execute();
}
