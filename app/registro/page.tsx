'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, telefono } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Si el proyecto no exige confirmación por correo, ya hay sesión.
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setOk(true);
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <div className="card text-center">
          <h1 className="mb-2 text-xl font-bold text-rivera-gold">¡Casi listo!</h1>
          <p className="text-sm text-slate-400">
            Revisa tu correo para confirmar tu cuenta y luego inicia sesión.
          </p>
          <Link href="/login" className="btn-primary mt-4">Ir a iniciar sesión</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="card">
        <h1 className="mb-1 text-2xl font-bold text-rivera-gold">Crear cuenta</h1>
        <p className="mb-6 text-sm text-slate-400">Rivera Élite Connect</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="nombre">Nombre</label>
            <input id="nombre" required className="input"
              value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="telefono">Teléfono (WhatsApp)</label>
            <input id="telefono" className="input" placeholder="10 dígitos"
              value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="email">Correo</label>
            <input id="email" type="email" required className="input"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <input id="password" type="password" required minLength={6} className="input"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-rivera-gold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
