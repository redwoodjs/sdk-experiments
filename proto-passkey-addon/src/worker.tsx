import { defineApp } from "rwsdk/worker";
import { index, render, route, prefix } from "rwsdk/router";
import { env } from "cloudflare:workers";
import debug from "debug";

import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { authRoutes } from "@/passkey";

const log = debug("passkey:worker");

export type AppContext = {};

// Initialize the passkey durable object
async function initializePasskeyDurableObject() {
  log("Initializing Passkey Durable Object");

  if (!env.PASSKEY_DURABLE_OBJECT) {
    log("ERROR: PASSKEY_DURABLE_OBJECT not found in environment");
    throw new Error("PASSKEY_DURABLE_OBJECT binding not found in environment");
  }

  try {
    // Create a unique ID for the durable object instance
    const durableObjectId =
      env.PASSKEY_DURABLE_OBJECT.idFromName("passkey-main");
    log("Created durable object ID: %s", durableObjectId.toString());

    // Get the durable object stub
    const durableObjectStub = env.PASSKEY_DURABLE_OBJECT.get(durableObjectId);
    log("Got durable object stub");

    // Initialize the durable object database directly via RPC
    log("Calling initialize() on durable object");
    await durableObjectStub.initialize();
    log("Passkey Durable Object initialized successfully");
  } catch (error) {
    log("ERROR during durable object initialization: %o", error);
    // Don't throw here - let the app start even if DO initialization fails
    // The functions will handle the error when they try to use the database
  }
}

export default defineApp([
  setCommonHeaders(),
  async ({ ctx }) => {
    log("Worker middleware executing");

    // Initialize the passkey durable object on startup
    await initializePasskeyDurableObject();

    // setup ctx here
    ctx;
    log("Worker middleware completed");
  },
  render(Document, [index([Home]), prefix("/auth", authRoutes())]),
]);

export { PasskeyDurableObject } from "@/passkey/durableObject";
