import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

//its Logout Page 
export async function POST() {
  await deleteSession();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
