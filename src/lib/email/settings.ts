import { prisma } from "@/server/db";

/**
 * Get a system setting by key.
 * Returns the parsed JSON value or undefined if not found.
 */
export async function getSystemSetting<T = unknown>(key: string): Promise<T | undefined> {
  const setting = await prisma.systemSetting.findUnique({
    where: { key },
  });

  if (!setting) return undefined;

  try {
    return JSON.parse(setting.value) as T;
  } catch {
    return setting.value as T;
  }
}

/**
 * Set a system setting by key.
 * Value is JSON-encoded before storage.
 */
export async function setSystemSetting(key: string, value: unknown): Promise<void> {
  const stringValue = typeof value === "string" ? value : JSON.stringify(value);

  await prisma.systemSetting.upsert({
    where: { key },
    update: { value: stringValue },
    create: { key, value: stringValue },
  });
}

// Default settings keys
export const SETTINGS = {
  EMAIL_ENABLED: "notifications.email.enabled",
  EMAIL_FROM: "notifications.email.from",
} as const;

/**
 * Check if email notifications are enabled globally.
 */
export async function isEmailEnabled(): Promise<boolean> {
  const enabled = await getSystemSetting<boolean>(SETTINGS.EMAIL_ENABLED);
  // Default to true if not set
  return enabled ?? true;
}

/**
 * Get the "from" address for notification emails.
 */
export async function getEmailFromAddress(): Promise<string> {
  const from = await getSystemSetting<string>(SETTINGS.EMAIL_FROM);
  return from ?? "Longhorn Sim Racing <noreply@notify.longhornsimracing.org>";
}
