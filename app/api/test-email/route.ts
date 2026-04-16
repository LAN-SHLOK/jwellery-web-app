import { NextResponse } from 'next/server';
import { getAdminInboxEmail, sendOrderConfirmation } from '@/lib/email';

// GET /api/test-email
// Only for local testing — remove before production
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const testEmail = getAdminInboxEmail();
  if (!testEmail) {
    return NextResponse.json({ error: 'No admin inbox is configured in .env.local' }, { status: 400 });
  }

  const result = await sendOrderConfirmation(testEmail, {
    orderId: 'TEST-ORDER-001',
    customerName: 'Test Customer',
    total: 45000,
    items: [
      { name: 'Royal Gold Ring', quantity: 1, price: 45000 },
    ],
  });

  if (result) {
    return NextResponse.json({ success: true, sentTo: testEmail });
  } else {
    return NextResponse.json({ error: 'Email failed — check terminal for details' }, { status: 500 });
  }
}
