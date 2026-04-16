import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { createSession } from '@/lib/auth';
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // rate limit by both email and IP — stops distributed brute force
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const ipKey = `ip:${ip}`;

    for (const key of [email, ipKey]) {
      const limit = checkRateLimit(key);
      if (!limit.allowed) {
        return NextResponse.json(
          { error: `Too many attempts. Try again in ${limit.lockoutMinutes} minutes.` },
          { status: 429 }
        );
      }
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, role')
      .eq('email', email)
      .eq('role', 'admin')
      .single();

    if (error || !user) {
      recordFailedAttempt(email);
      recordFailedAttempt(ipKey);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordOk = await bcrypt.compare(password, user.password_hash);
    if (!passwordOk) {
      recordFailedAttempt(email);
      recordFailedAttempt(ipKey);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await createSession(user.id);
    clearAttempts(email);
    clearAttempts(ipKey);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[admin/login]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
