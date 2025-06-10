import { env } from "cloudflare:workers";

export async function setupPasskeys() {
  if (!env.PASSKEY_DURABLE_OBJECT) {
    throw new Error("PASSKEY_DURABLE_OBJECT binding not found in environment");
  }

  const durableObjectId = env.PASSKEY_DURABLE_OBJECT.idFromName("passkey-main");
  const durableObjectStub = env.PASSKEY_DURABLE_OBJECT.get(durableObjectId);
  await durableObjectStub.initialize();
}
