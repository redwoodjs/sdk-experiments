"use client";

import { useState, useTransition } from "react";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import {
  finishPasskeyLogin,
  finishPasskeyRegistration,
  startPasskeyLogin,
  startPasskeyRegistration,
} from "../functions";
import debug from "../../sdk/logger.js";

const log = debug("passkey:login-component");

export function Login() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();

  log("Login component rendered");

  const passkeyLogin = async () => {
    log("Starting passkey login flow");

    try {
      // 1. Get a challenge from the worker
      log("Step 1: Getting challenge from worker");
      const options = await startPasskeyLogin();
      log("Received login options: %o", {
        challenge: options.challenge,
      });

      // 2. Ask the browser to sign the challenge
      log("Step 2: Starting browser authentication");
      const login = await startAuthentication({ optionsJSON: options });
      log("Browser authentication completed: %o", {
        id: login.id,
        type: login.type,
      });

      // 3. Give the signed challenge to the worker to finish the login process
      log("Step 3: Finishing login with worker");
      const success = await finishPasskeyLogin(login);
      log("Login result: %s", success ? "success" : "failed");

      if (!success) {
        log("Login failed - setting error result");
        setResult("Login failed");
      } else {
        log("Login successful - setting success result");
        setResult("Login successful!");
      }
    } catch (error: unknown) {
      log("ERROR during passkey login: %o", error);
      setResult(
        `Login error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const passkeyRegister = async () => {
    log(
      "Starting passkey registration flow for username: %s",
      username
    );

    if (!username.trim()) {
      log("ERROR: Username is empty");
      setResult("Please enter a username");
      return;
    }

    try {
      // 1. Get a challenge from the worker
      log("Step 1: Getting registration challenge from worker");
      const options = await startPasskeyRegistration(username);
      log("Received registration options: %o", {
        challenge: options.challenge,
        user: options.user,
      });

      // 2. Ask the browser to sign the challenge
      log("Step 2: Starting browser registration");
      const registration = await startRegistration({ optionsJSON: options });
      log("Browser registration completed: %o", {
        id: registration.id,
        type: registration.type,
      });

      // 3. Give the signed challenge to the worker to finish the registration process
      log("Step 3: Finishing registration with worker");
      const success = await finishPasskeyRegistration(username, registration);
      log(
        "Registration result: %s",
        success ? "success" : "failed"
      );

      if (!success) {
        log("Registration failed - setting error result");
        setResult("Registration failed");
      } else {
        log("Registration successful - setting success result");
        setResult("Registration successful!");
      }
    } catch (error: unknown) {
      log("ERROR during passkey registration: %o", error);
      setResult(
        `Registration error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handlePerformPasskeyLogin = () => {
    log("Login button clicked");
    startTransition(() => void passkeyLogin());
  };

  const handlePerformPasskeyRegister = () => {
    log("Register button clicked for username: %s", username);
    startTransition(() => void passkeyRegister());
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    log("Username changed: %s", newUsername);
    setUsername(newUsername);
  };

  return (
    <>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Username"
      />
      <button onClick={handlePerformPasskeyLogin} disabled={isPending}>
        {isPending ? <>...</> : "Login with passkey"}
      </button>
      <button onClick={handlePerformPasskeyRegister} disabled={isPending}>
        {isPending ? <>...</> : "Register with passkey"}
      </button>
      {result && <div>{result}</div>}
    </>
  );
}
