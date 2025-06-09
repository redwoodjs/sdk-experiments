"use server";

import {
  generateRegistrationOptions,
  generateAuthenticationOptions,
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";

import { requestInfo } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { Kysely } from "kysely";
import {
  Database,
  createUser,
  createCredential,
  getCredentialById,
  updateCredentialCounter,
} from "./database.js";
import debug from "../sdk/logger.js";

const log = debug("passkey:functions");

const IS_DEV = process.env.NODE_ENV === "development";

function getWebAuthnConfig(request: Request) {
  const rpID = process.env.WEBAUTHN_RP_ID ?? new URL(request.url).hostname;
  const rpName = IS_DEV
    ? "Development App"
    : process.env.WEBAUTHN_APP_NAME || "Passkey App";
  log("WebAuthn config: rpID=%s, rpName=%s", rpID, rpName);
  return {
    rpName,
    rpID,
  };
}

// Session management - simplified for this example
// In production, you'd want proper session management
const sessions = new Map<string, { challenge?: string }>();

function getSessionId(headers: Headers): string {
  // Simple session ID generation - in production use proper session management
  const sessionId = headers.get("x-session-id");
  const result = sessionId || crypto.randomUUID();
  log("Session ID: %s (existing: %s)", result, !!sessionId);
  return result;
}

async function saveSession(
  headers: Headers,
  data: { challenge?: string | null }
) {
  const sessionId = getSessionId(headers);
  if (data.challenge === null) {
    log("Deleting session: %s", sessionId);
    sessions.delete(sessionId);
  } else {
    log("Saving session: %s with challenge", sessionId);
    sessions.set(sessionId, { challenge: data.challenge });
  }
  return sessionId;
}

async function loadSession(request: Request) {
  const sessionId = getSessionId(request.headers);
  const session = sessions.get(sessionId) || null;
  log("Loading session: %s (found: %s)", sessionId, !!session);
  return session;
}

// Get the database from the Durable Object
// This returns a proxied database that routes calls through the DO
async function getDatabase(): Promise<Kysely<Database>> {
  log("Getting database from Durable Object");

  if (!env.PASSKEY_DURABLE_OBJECT) {
    log("ERROR: PASSKEY_DURABLE_OBJECT not found in environment");
    throw new Error("PASSKEY_DURABLE_OBJECT binding not found in environment");
  }

  // Create a unique ID for the durable object instance
  // In a real app, you might want different instances for different tenants
  const durableObjectId = env.PASSKEY_DURABLE_OBJECT.idFromName("passkey-main");
  log("Created durable object ID: %s", durableObjectId.toString());

  // Get the durable object stub
  const durableObjectStub = env.PASSKEY_DURABLE_OBJECT.get(durableObjectId);
  log("Got durable object stub");

  // Get the database instance (proxied through RPC)
  log("Calling getDb() on durable object");
  const db = await durableObjectStub.getDb();
  log("Received database instance from durable object");

  return db;
}

export async function startPasskeyRegistration(username: string) {
  log("Starting passkey registration for username: %s", username);

  const { rpName, rpID } = getWebAuthnConfig(requestInfo.request);
  const { headers } = requestInfo;

  log("Generating registration options");
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: username,
    authenticatorSelection: {
      // Require the authenticator to store the credential, enabling a username-less login experience
      residentKey: "required",
      // Prefer user verification (biometric, PIN, etc.), but allow authentication even if it's not available
      userVerification: "preferred",
    },
  });

  log(
    "Generated registration options with challenge: %s",
    options.challenge
  );
  await saveSession(headers, { challenge: options.challenge });

  log("Registration options ready for username: %s", username);
  return options;
}

export async function startPasskeyLogin() {
  log("Starting passkey login");

  const { rpID } = getWebAuthnConfig(requestInfo.request);
  const { headers } = requestInfo;

  log("Generating authentication options");
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
    allowCredentials: [],
  });

  log(
    "Generated authentication options with challenge: %s",
    options.challenge
  );
  await saveSession(headers, { challenge: options.challenge });

  log("Authentication options ready");
  return options;
}

export async function finishPasskeyRegistration(
  username: string,
  registration: RegistrationResponseJSON
) {
  log("Finishing passkey registration for username: %s", username);

  const { request, headers } = requestInfo;
  const { origin } = new URL(request.url);

  log("Loading session for registration verification");
  const session = await loadSession(request);
  const challenge = session?.challenge;

  if (!challenge) {
    log("ERROR: No challenge found in session for registration");
    return false;
  }

  log("Verifying registration response");
  const verification = await verifyRegistrationResponse({
    response: registration,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: process.env.WEBAUTHN_RP_ID || new URL(request.url).hostname,
  });

  if (!verification.verified || !verification.registrationInfo) {
    log("ERROR: Registration verification failed");
    return false;
  }

  log("Registration verification successful");
  await saveSession(headers, { challenge: null });

  try {
    log("Getting database connection");
    const db = await getDatabase();

    log("Creating user in database");
    const user = await createUser(db, username);
    log("Created user with ID: %s", user.id);

    log("Creating credential in database for user: %s", user.id);
    await createCredential(db, {
      userId: user.id,
      credentialId: verification.registrationInfo.credential.id,
      publicKey: verification.registrationInfo.credential.publicKey,
      counter: verification.registrationInfo.credential.counter,
    });

    log(
      "Successfully completed passkey registration for username: %s",
      username
    );
    return true;
  } catch (error) {
    log("ERROR during database operations: %o", error);
    throw error;
  }
}

export async function finishPasskeyLogin(
  authentication: AuthenticationResponseJSON
) {
  log(
    "Finishing passkey login for credential ID: %s",
    authentication.id
  );

  const { request, headers } = requestInfo;
  const { origin } = new URL(request.url);

  log("Loading session for authentication verification");
  const session = await loadSession(request);
  const challenge = session?.challenge;

  if (!challenge) {
    log("ERROR: No challenge found in session for authentication");
    return false;
  }

  try {
    log("Getting database connection");
    const db = await getDatabase();

    log("Looking up credential in database");
    const credential = await getCredentialById(db, authentication.id);

    if (!credential) {
      log(
        "ERROR: Credential not found in database: %s",
        authentication.id
      );
      return false;
    }

    log("Found credential, verifying authentication response");
    const verification = await verifyAuthenticationResponse({
      response: authentication,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: process.env.WEBAUTHN_RP_ID || new URL(request.url).hostname,
      credential: {
        id: credential.credentialId,
        publicKey: credential.publicKey,
        counter: credential.counter,
      },
    });

    if (!verification.verified) {
      log("ERROR: Authentication verification failed");
      return false;
    }

    log("Authentication verification successful");
    await saveSession(headers, { challenge: null });

    // Update the counter
    log(
      "Updating credential counter from %d to %d",
      credential.counter,
      verification.authenticationInfo.newCounter
    );
    await updateCredentialCounter(
      db,
      credential.credentialId,
      verification.authenticationInfo.newCounter
    );

    log(
      "Successfully completed passkey login for credential: %s",
      authentication.id
    );
    return true;
  } catch (error) {
    log("ERROR during database operations: %o", error);
    throw error;
  }
}
