import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAdminInboxEmail, sendGoldRateReminder } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

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

    console.log('[cron] Checking gold rate from:', todayUtcStart.toISOString());

    // Use limit(1) — .single() throws when multiple rows match, causing false reminders
    const { data: rows, error } = await supabaseAdmin
      .from('gold_rates')
      .select('id, created_at')
      .gte('created_at', todayUtcStart.toISOString())
      .limit(1);

    console.log('[cron] Query result:', { rows, error, count: rows?.length });
    const rateEnteredToday = !error && rows && rows.length > 0;

    if (!rateEnteredToday) {
      const adminEmail = getAdminInboxEmail();
      console.log('[cron] Admin email:', adminEmail);
      
      if (!adminEmail) {
        console.error('[cron] no admin inbox configured - cannot send reminder');
        return NextResponse.json({ message: 'Admin inbox not configured', action: 'skipped' });
      }

      console.log('[cron] Attempting to send email to:', adminEmail);
      const emailSent = await sendGoldRateReminder(adminEmail);
      console.log('[cron] Email send result:', emailSent);
      
      if (!emailSent) {
        console.error('[cron] Failed to send reminder email');
      }

      return NextResponse.json({
        message: emailSent ? 'Reminder sent' : 'Reminder failed',
        action: 'emailed_admin',
        emailSent,
        sentTo: adminEmail,
      });
    }

    return NextResponse.json({ message: 'Rate already entered today', action: 'none' });

  } catch (err) {
    console.error('[cron] unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
