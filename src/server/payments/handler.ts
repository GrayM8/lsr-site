// src/server/payments/handler.ts
import { prisma } from '@/server/db';
import { createAuditLog } from '@/server/audit/log';
import { Payment } from '@prisma/client';

// This is a stub implementation. In a real app, you would pass in the full payment object from Stripe, etc.
export async function onPaymentSucceeded(payment: Payment) {
  const product = await prisma.product.findUnique({ where: { id: payment.productId } });
  if (!product) {
    console.error(`Product not found for payment ${payment.id}`);
    return;
  }

  let entitlement;
  const now = new Date();

  if (product.type === 'ANNUAL_DUES') {
    // August 1 to July 31 window
    const startYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
    const validFrom = new Date(startYear, 7, 1);
    const validTo = new Date(startYear + 1, 6, 31, 23, 59, 59, 999);

    entitlement = await prisma.entitlement.create({
      data: {
        userId: payment.userId,
        kind: 'lsr_member',
        scope: 'year',
        validFrom,
        validTo,
        sourcePaymentId: payment.id,
      },
    });
  } else if (product.type === 'LEAGUE_FEE' && product.leagueId) {
    // For now, assume year scope. Season scope would require more logic.
    const validFrom = new Date(now.getFullYear(), 0, 1);
    const validTo = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    entitlement = await prisma.entitlement.create({
      data: {
        userId: payment.userId,
        kind: 'league_access',
        leagueId: product.leagueId,
        scope: 'year', // or 'season'
        validFrom,
        validTo,
        sourcePaymentId: payment.id,
      },
    });
  }

  if (entitlement) {
    await createAuditLog({
      actorUserId: payment.userId,
      actionType: 'PAYMENT_SUCCESS',
      entityType: 'ENTITLEMENT',
      entityId: entitlement.id,
      summary: `Payment succeeded for product ${product.type}`,
      metadata: { paymentId: payment.id, productType: product.type },
      after: entitlement,
    });
  }
}
