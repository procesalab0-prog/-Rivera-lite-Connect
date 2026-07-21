import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import BotonImprimir from '@/components/BotonImprimir';
import { labelEtapa } from '@/lib/etapas';
import type { Orden, Vehiculo } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ReciboPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: vehiculo } = await supabase
    .from('vehiculos')
    .select('*')
    .eq('id', params.id)
    .single();
  if (!vehiculo) notFound();
  const v = vehiculo as Vehiculo;

  const { data: ordenes } = await supabase
    .from('ordenes')
    .select('*')
    .eq('vehiculo_id', v.id)
    .order('created_at', { ascending: false });
  const orden = (ordenes?.[0] as Orden) ?? null;

  const money = (n: number | null) =>
    n == null
      ? '—'
      : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

  return (
    <main className="mx-auto max-w-2xl bg-white px-8 py-10 text-slate-900 print:py-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rivera Élite Garage</h1>
          <p className="text-sm text-slate-500">Recibo de servicio</p>
        </div>
        <span className="text-3xl">🏁</span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <h2 className="font-semibold">Vehículo</h2>
          <p>{v.marca} {v.modelo} {v.anio ?? ''}</p>
          {v.placa && <p>Placa: {v.placa}</p>}
          {v.color && <p>Color: {v.color}</p>}
          {v.vin && <p>VIN: {v.vin}</p>}
        </div>
        <div>
          <h2 className="font-semibold">Servicio</h2>
          <p>{orden?.titulo ?? '—'}</p>
          <p>Estatus: {orden ? labelEtapa(orden.estatus) : '—'}</p>
          {orden?.mecanico && <p>Mecánico: {orden.mecanico}</p>}
          {orden?.fecha_entrega_real && (
            <p>Entregado: {new Date(orden.fecha_entrega_real).toLocaleDateString('es-MX')}</p>
          )}
        </div>
      </div>

      {orden?.descripcion && (
        <div className="mb-6 text-sm">
          <h2 className="font-semibold">Detalle</h2>
          <p>{orden.descripcion}</p>
        </div>
      )}

      <div className="mb-8 border-t border-slate-300 pt-4 text-right">
        <span className="text-sm text-slate-500">Total</span>
        <p className="text-2xl font-bold">{money(orden?.costo_estimado ?? null)}</p>
      </div>

      <div className="flex gap-3 print:hidden">
        <BotonImprimir />
        <Link href={`/carro/${v.id}`} className="btn-ghost text-slate-700">Volver</Link>
      </div>
    </main>
  );
}
