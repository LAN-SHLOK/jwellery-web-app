import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST() {
  await deleteSession();
  
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // Clear the cookie on the response as well
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    sameSite: 'lax',
    path: '/',
  });
  
  // Add cache control headers to prevent back button access
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}
