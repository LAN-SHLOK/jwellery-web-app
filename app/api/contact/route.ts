import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminInboxEmail, sendContactInquiry } from '@/lib/email';

const contactSchema = z.object({
  name:    z.string().min(2, 'Name required'),
  email:   z.string().email('Valid email required'),
  phone:   z.string().optional(),
  message: z.string().min(5, 'Message required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { name, email, phone, message } = result.data;

    const adminEmail = getAdminInboxEmail();
    if (!adminEmail) {
      console.error('[contact] no admin inbox is configured');
      return NextResponse.json(
        { error: 'Contact service is currently unavailable. Please try WhatsApp instead.' }, 
        { status: 503 }
      );
    }

    const sent = await sendContactInquiry(adminEmail, { name, email, phone, message });

    if (!sent) {
      return NextResponse.json(
        { error: 'Failed to send message. Please try again or use WhatsApp.' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] unexpected error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
