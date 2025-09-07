"use client";

import "@react-email/render";
import { Resend } from "resend";
import WelcomeEmail from "./WelcomeEmail";

export const ssrSendWelcomeEmail = async (apiKey: string, email: string) => {
  const resend = new Resend(apiKey);

  return await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "👋 Welcome",
    react: <WelcomeEmail name={email} />,
  });
};
