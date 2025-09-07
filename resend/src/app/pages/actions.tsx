"use server";

import { env } from "cloudflare:workers";
import { ssrSendWelcomeEmail } from "@/app/email/ssrSendWelcomeEmail";
import { resolveSSRValue } from "rwsdk/worker";

export async function sendWelcomeEmail(formData: FormData) {
  const doSendWelcomeEmail = await resolveSSRValue(ssrSendWelcomeEmail);

  const email = formData.get("email") as string;

  if (!email) {
    console.error("❌ Email is required");
    return { error: "Email is required", success: false };
  }

  const { data, error } = await doSendWelcomeEmail(env.RESEND_API, email);

  if (error) {
    console.error("❌ Error sending email", error);
    return { error: error.message, success: false };
  }

  console.log("📥 Email sent successfully", data);
  return { success: true, error: null };
}
