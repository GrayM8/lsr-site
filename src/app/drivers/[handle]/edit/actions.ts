'use server';

import { z } from 'zod';
import { prisma } from '@/server/db';
import { requireUser } from '@/server/auth/guards';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Schema shared by the action
const UserSchema = z.object({
  displayName: z.string().min(2).max(80),
  iRating: z.union([z.string(), z.number()]).optional().transform(v => {
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    return Number.isFinite(n as number) ? Number(n) : null;
  }),
  bio: z.string().max(2000).optional().nullable(),
  gradYear: z.union([z.string(), z.number()]).optional().transform(v => {
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    return Number.isFinite(n as number) ? Number(n) : null;
  }),
  major: z.string().max(100).optional().nullable(),
  website: z.string().url().optional().or(z.literal('')).transform(v => v || null),
  instagram: z.string().url().optional().or(z.literal('')).transform(v => v || null),
  twitch: z.string().url().optional().or(z.literal('')).transform(v => v || null),
  youtube: z.string().url().optional().or(z.literal('')).transform(v => v || null),
});

// ----- SERVER ACTION (single-arg shape for <form action={...}>) -----
export async function updateProfile(formData: FormData) {
  const user = await requireUser();

  const parsed = UserSchema.safeParse({
    displayName: formData.get('displayName'),
    iRating: formData.get('iRating'),
    bio: formData.get('bio'),
    gradYear: formData.get('gradYear'),
    major: formData.get('major'),
    website: formData.get('website'),
    instagram: formData.get('instagram'),
    twitch: formData.get('twitch'),
    youtube: formData.get('youtube'),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.flatten().formErrors.join(', ') || 'Invalid input.');
  }

  const prevSocials = (user.socials as Record<string, string> | null) ?? {};
  await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName: parsed.data.displayName,
      iRating: parsed.data.iRating ?? undefined,
      bio: parsed.data.bio ?? undefined,
      gradYear: parsed.data.gradYear ?? undefined,
      major: parsed.data.major ?? undefined,
      socials: {
        ...prevSocials,
        website: parsed.data.website,
        instagram: parsed.data.instagram,
        twitch: parsed.data.twitch,
        youtube: parsed.data.youtube,
      },
    },
  });

  revalidatePath(`/drivers/${user.handle}`);
  redirect(`/drivers/${user.handle}`);
}

export async function saveAvatar(url: string) {
  const user = await requireUser();

  await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl: url },
  });

  revalidatePath(`/drivers/${user.handle}`);
}

export async function clearAvatar() {
  const user = await requireUser();

  await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl: null },
  });

  revalidatePath(`/drivers/${user.handle}`);
}

