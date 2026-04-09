'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    <div className="min-h-screen flex items-center justify-center bg-brand-muted px-6 relative overflow-hidden">
      <motion.div
        className="absolute top-20 left-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-brand-primary/15 to-transparent blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-[15%] w-80 h-80 rounded-full bg-gradient-to-br from-brand-accent/12 to-transparent blur-3xl"
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="w-full max-w-md bg-white border border-black/5 shadow-xl p-12 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl font-serif mb-2 tracking-widest uppercase">Admin Access</h1>
          <p className="text-xs uppercase tracking-widest opacity-60">{BRAND_CONFIG.name} Management</p>
        </motion.div>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs text-center font-bold uppercase tracking-widest"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
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

          <motion.button 
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center bg-brand-primary text-white text-xs tracking-widest uppercase hover:bg-brand-accent transition-colors duration-300 mt-8 disabled:opacity-50"
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                Authenticating...
              </motion.div>
            ) : (
              'Authenticate'
            )}
          </motion.button>
        </form>

        <motion.div
          className="mt-12 pt-8 border-t border-black/5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[10px] uppercase tracking-widest">
            Powered by {BRAND_CONFIG.name}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
