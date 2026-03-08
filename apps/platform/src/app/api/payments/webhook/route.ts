// app/api/payments/webhook/route.ts
import { NextResponse } from 'next/server';
import { onPaymentSucceeded } from '@/server/payments/handler';
import { prisma } from '@/server/db';

export const runtime = 'nodejs';

// This is a mock webhook endpoint for testing.
// In a real app, you would validate the request signature from the payment provider.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId } = body; // Assume the body contains a paymentId

    if (!paymentId) {
      return NextResponse.json({ message: 'Missing paymentId' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    // In a real app, you'd verify the payment status with the provider before processing.
    if (payment.status === 'succeeded') {
      await onPaymentSucceeded(payment);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error in payment webhook:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
