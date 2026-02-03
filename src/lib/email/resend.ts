import { Resend } from "resend";
import { isEmailEnabled, getEmailFromAddress } from "./settings";

// Lazy initialization of Resend client
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export type SendEmailResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

/**
 * Send an email via Resend.
 * Respects the global email enabled setting.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailParams): Promise<SendEmailResult> {
  // Check if email is enabled globally
  const enabled = await isEmailEnabled();
  if (!enabled) {
    console.log("[Email] System disabled, skipping:", subject, "to:", to);
    return { success: false, error: "Email system disabled" };
  }

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error("[Email] RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  const from = await getEmailFromAddress();

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      replyTo,
    });

    if (result.error) {
      console.error("[Email] Send failed:", result.error);
      return { success: false, error: result.error.message };
    }

    console.log("[Email] Sent successfully:", result.data?.id, "to:", to);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("[Email] Send exception:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send a batch of emails.
 * Uses Resend's batch API for efficiency.
 */
export async function sendBatchEmails(
  emails: Array<Omit<SendEmailParams, "replyTo">>
): Promise<SendEmailResult[]> {
  const enabled = await isEmailEnabled();
  if (!enabled) {
    console.log("[Email] System disabled, skipping batch of", emails.length);
    return emails.map(() => ({ success: false, error: "Email system disabled" }));
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[Email] RESEND_API_KEY not configured");
    return emails.map(() => ({ success: false, error: "Email service not configured" }));
  }

  const from = await getEmailFromAddress();

  try {
    const resend = getResendClient();
    const result = await resend.batch.send(
      emails.map((email) => ({
        from,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }))
    );

    if (result.error) {
      console.error("[Email] Batch send failed:", result.error);
      return emails.map(() => ({ success: false, error: result.error?.message }));
    }

    console.log("[Email] Batch sent:", result.data?.data?.length, "emails");
    return (
      result.data?.data?.map((r) => ({
        success: true,
        messageId: r.id,
      })) ?? emails.map(() => ({ success: true }))
    );
  } catch (error) {
    console.error("[Email] Batch send exception:", error);
    return emails.map(() => ({ success: false, error: String(error) }));
  }
}
