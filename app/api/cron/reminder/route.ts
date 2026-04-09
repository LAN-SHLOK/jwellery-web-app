import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAdminInboxEmail, sendGoldRateReminder } from '@/lib/email';

// GET /api/cron/reminder
// Triggered by Vercel Cron at 1:45 PM IST (08:15 UTC) daily.
// Checks if any gold rate has been entered today (IST midnight → now).
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  // In development, allow without the header for local testing.
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    
    const now = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const nowIst = new Date(now.getTime() + istOffsetMs);
    const todayIstMidnight = new Date(
      Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), nowIst.getUTCDate())
    );
    const todayUtcStart = new Date(todayIstMidnight.getTime() - istOffsetMs);

    // Use limit(1) — .single() throws when multiple rows match, causing false reminders
    const { data: rows, error } = await supabase
      .from('gold_rates')
      .select('created_at')
      .gte('created_at', todayUtcStart.toISOString())
      .limit(1);

    const rateEnteredToday = !error && rows && rows.length > 0;

    if (!rateEnteredToday) {
      const adminEmail = getAdminInboxEmail();
      if (!adminEmail) {
        console.error('[cron] no admin inbox configured - cannot send reminder');
        return NextResponse.json({ message: 'Admin inbox not configured', action: 'skipped' });
      }

      const emailSent = await sendGoldRateReminder(adminEmail);
      if (!emailSent) {
        console.error('[cron] Failed to send reminder email');
      }

      return NextResponse.json({
        message: emailSent ? 'Reminder sent' : 'Reminder failed',
        action: 'emailed_admin',
        emailSent,
      });
    }

    return NextResponse.json({ message: 'Rate already entered today', action: 'none' });

  } catch (err) {
    console.error('[cron] unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
