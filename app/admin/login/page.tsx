'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND_CONFIG } from "@/config/brand";

//It is an Admin Page

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

  
      router.push('/admin/dashboard');
      router.refresh(); 
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-muted px-6">
      <div className="w-full max-w-md bg-white border border-black/5 shadow-xl p-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif mb-2 tracking-widest uppercase">Admin Access</h1>
          <p className="text-xs uppercase tracking-widest opacity-60">{BRAND_CONFIG.name} Management</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs text-center font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="admin@example.com"
              className="w-full h-12 bg-zinc-50 border border-black/5 px-4 text-sm focus:outline-none focus:border-brand-accent transition-all"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full h-12 bg-zinc-50 border border-black/5 px-4 text-sm focus:outline-none focus:border-brand-accent transition-all"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center bg-brand-primary text-white text-xs tracking-widest uppercase hover:bg-brand-accent transition-colors duration-300 mt-8 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-black/5 text-center">
          <p className="text-[10px] uppercase tracking-widest opacity-40">
            Powered by {BRAND_CONFIG.name}
          </p>
        </div>
      </div>
    </div>
  );
}
