import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Herbal Communities <onboarding@resend.dev>";

export const ADMIN_NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || process.env.RESEND_FROM_EMAIL || "";
