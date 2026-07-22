'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Marca from '@/components/Marca';

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

    const { data } = await supabase.auth.getSession();
    if (data.session) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setOk(true);
      setLoading(false);
    }
  }

  const wrap =
    'mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10 animate-riseIn';
  const bg = { background: 'linear-gradient(168deg,#4a080d,#1a0406 40%,#0B0C0E 74%)' };

  if (ok) {
    return (
      <main className={wrap} style={bg}>
        <div className="card text-center">
          <h1 className="mb-2 font-cond text-xl font-bold text-rivera-red">¡Casi listo!</h1>
          <p className="text-sm text-rivera-muted">
            Revisa tu correo para confirmar tu cuenta y luego inicia sesión.
          </p>
          <Link href="/login" className="btn-primary mt-4">Ir a iniciar sesión</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={wrap} style={bg}>
      <div className="mb-5 flex justify-center">
        <Marca size="34px" />
      </div>
      <div
        className="rounded-[22px] border border-rivera-border p-6 shadow-[0_20px_50px_rgba(0,0,0,.5)]"
        style={{ background: 'rgba(22,24,29,.75)', backdropFilter: 'blur(8px)' }}
      >
        <h1 className="mb-1 font-cond text-2xl font-bold">Crear cuenta</h1>
        <p className="mb-5 text-sm text-rivera-muted">Únete a Rivera Élite Connect.</p>
        <form onSubmit={onSubmit} className="grid gap-3.5">
          <div>
            <label className="label" htmlFor="nombre">Nombre</label>
            <input id="nombre" required className="input" placeholder="Tu nombre completo"
              value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="telefono">Teléfono (WhatsApp)</label>
            <input id="telefono" className="input" placeholder="10 dígitos"
              value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="email">Correo</label>
            <input id="email" type="email" required className="input" placeholder="tucorreo@ejemplo.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <input id="password" type="password" required minLength={6} className="input" placeholder="Mínimo 6 caracteres"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-1 w-full">
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-rivera-muted">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-semibold text-rivera-red hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
