'use server';

import { prisma } from '@/server/db';
import { requireUser } from '@/server/auth/guards';
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

  await prisma.user.update({
    where: { id: user.id },
    data: { status: 'retired' },
  });

  redirect('/account/retired');
}

export async function deleteAccount() {
  const user = await requireUser();

  await prisma.user.delete({ where: { id: user.id } });

  redirect('/?account=deleted');
}

