'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Marca from '@/components/Marca';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol')
      .eq('id', userData.user?.id ?? '')
      .single();

    router.push(profile?.rol === 'admin' ? '/admin' : '/dashboard');
    router.refresh();
  }

  return (
    <main
      className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10 animate-riseIn"
      style={{ background: 'linear-gradient(168deg,#4a080d,#1a0406 40%,#0B0C0E 74%)' }}
    >
      <div className="mb-6 flex justify-center">
        <Marca size="38px" sub />
      </div>
      <div
        className="rounded-[22px] border border-rivera-border p-6 shadow-[0_20px_50px_rgba(0,0,0,.5)]"
        style={{ background: 'rgba(22,24,29,.75)', backdropFilter: 'blur(8px)' }}
      >
        <h1 className="mb-1 font-cond text-2xl font-bold">Inicia sesión</h1>
        <p className="mb-5 text-sm text-rivera-muted">Entra para ver tus carros.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Correo</label>
            <input id="email" type="email" required className="input" placeholder="tucorreo@ejemplo.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <input id="password" type="password" required className="input" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-rivera-muted">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-semibold text-rivera-red hover:underline">Regístrate</Link>
        </p>
      </div>
    </main>
  );
}
