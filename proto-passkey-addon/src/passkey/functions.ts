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
import { Kysely } from "kysely";
import {
  Database,
  createUser,
  createCredential,
  getCredentialById,
  updateCredentialCounter,
} from "./database.js";

const IS_DEV = process.env.NODE_ENV === "development";

function getWebAuthnConfig(request: Request) {
  const rpID = process.env.WEBAUTHN_RP_ID ?? new URL(request.url).hostname;
  const rpName = IS_DEV
    ? "Development App"
    : process.env.WEBAUTHN_APP_NAME || "Passkey App";
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
  return sessionId || crypto.randomUUID();
}

async function saveSession(
  headers: Headers,
  data: { challenge?: string | null }
) {
  const sessionId = getSessionId(headers);
  if (data.challenge === null) {
    sessions.delete(sessionId);
  } else {
    sessions.set(sessionId, { challenge: data.challenge });
  }
  return sessionId;
}

async function loadSession(request: Request) {
  const sessionId = getSessionId(request.headers);
  return sessions.get(sessionId) || null;
}

// TODO: Get the database from context/environment
// This would be injected from the worker context in a real app
function getDatabase(): Kysely<Database> {
  throw new Error(
    "Database not yet connected - needs to be injected from worker context"
  );
}

export async function startPasskeyRegistration(username: string) {
  const { rpName, rpID } = getWebAuthnConfig(requestInfo.request);
  const { headers } = requestInfo;

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

  await saveSession(headers, { challenge: options.challenge });

  return options;
}

export async function startPasskeyLogin() {
  const { rpID } = getWebAuthnConfig(requestInfo.request);
  const { headers } = requestInfo;

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
    allowCredentials: [],
  });

  await saveSession(headers, { challenge: options.challenge });

  return options;
}

export async function finishPasskeyRegistration(
  username: string,
  registration: RegistrationResponseJSON
) {
  const { request, headers } = requestInfo;
  const { origin } = new URL(request.url);

  const session = await loadSession(request);
  const challenge = session?.challenge;

  if (!challenge) {
    return false;
  }

  const verification = await verifyRegistrationResponse({
    response: registration,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: process.env.WEBAUTHN_RP_ID || new URL(request.url).hostname,
  });

  if (!verification.verified || !verification.registrationInfo) {
    return false;
  }

  await saveSession(headers, { challenge: null });

  const db = getDatabase();
  const user = await createUser(db, username);

  await createCredential(db, {
    userId: user.id,
    credentialId: verification.registrationInfo.credential.id,
    publicKey: verification.registrationInfo.credential.publicKey,
    counter: verification.registrationInfo.credential.counter,
  });

  return true;
}

export async function finishPasskeyLogin(
  authentication: AuthenticationResponseJSON
) {
  const { request, headers } = requestInfo;
  const { origin } = new URL(request.url);

  const session = await loadSession(request);
  const challenge = session?.challenge;

  if (!challenge) {
    return false;
  }

  const db = getDatabase();
  const credential = await getCredentialById(db, authentication.id);

  if (!credential) {
    return false;
  }

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
    return false;
  }

  await saveSession(headers, { challenge: null });

  // Update the counter
  await updateCredentialCounter(
    db,
    credential.credentialId,
    verification.authenticationInfo.newCounter
  );

  return true;
}
