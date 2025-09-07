"use server";

import { Resend } from "resend";
import { env } from "cloudflare:workers";
import WelcomeEmail from "@/app/email/WelcomeEmail";
import { renderToString } from "rwsdk/worker";

export async function sendWelcomeEmail(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    console.error("❌ Email is required");
    return { error: "Email is required", success: false };
  }

  const resend = new Resend(env.RESEND_API);

  console.log(await renderToString(WelcomeEmail({ name: email })));

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "👋 Welcome",
    html: await renderToString(WelcomeEmail({ name: email })),
  });

  if (error) {
    console.error("❌ Error sending email", error);
    return { error: error.message, success: false };
  }

  console.log("📥 Email sent successfully", data);
  return { success: true, error: null };
}
