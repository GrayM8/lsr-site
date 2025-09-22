'use server';

import { prisma } from '@/server/db';
import { requireUser } from '@/server/auth/guards';
import { createSupabaseServer } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateMarketingOptIn(formData: FormData) {
  const user = await requireUser();
  const val = formData.get('marketingOptIn');
  const checked = val === 'on' || val === 'true' || val === '1';

  await prisma.user.update({
    where: { id: user.id },
    data: { marketingOptIn: checked },
  });

  revalidatePath('/account');
}

export async function retireAccount() {
  const user = await requireUser();
  const supabase = await createSupabaseServer();

  await prisma.user.update({
    where: { id: user.id },
    data: { status: 'retired' },
  });

  // Immediately sign them out so the session stops working
  await supabase.auth.signOut();

  redirect('/account/retired');
}

export async function deleteAccount() {
  const user = await requireUser();
  const supabase = await createSupabaseServer();

  // 1) Sign out first (clears cookies)
  await supabase.auth.signOut();

  // 2) Remove User from our DB (scrub PII)
  await prisma.user.delete({ where: { id: user.id } });

  // 3) Delete user from Supabase Auth using service role (server-side only)
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // DO NOT expose client-side
    { auth: { persistSession: false } }
  );
  await admin.auth.admin.deleteUser(user.id);

  redirect('/?account=deleted');
}

