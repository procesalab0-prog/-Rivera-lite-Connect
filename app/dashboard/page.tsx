import { createClient } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { DEMO_CLIENTE, DEMO_VEHICULOS, DEMO_ORDENES } from '@/lib/demo';
import DemoBanner from '@/components/DemoBanner';
import ClienteTabBar from '@/components/ClienteTabBar';
import EasterEgg from '@/components/EasterEgg';
import TarjetaCarro from '@/components/TarjetaCarro';
import type { Orden, Vehiculo } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const demo = !supabaseConfigurado();
  let nombre = 'cliente';
  let vehiculos: Vehiculo[] = [];
  const ultimaOrdenPorVehiculo = new Map<string, Orden>();

  if (demo) {
    nombre = DEMO_CLIENTE.nombre ?? 'cliente';
    vehiculos = DEMO_VEHICULOS.filter((v) => v.cliente_id === DEMO_CLIENTE.id);
    for (const o of DEMO_ORDENES) {
      if (!ultimaOrdenPorVehiculo.has(o.vehiculo_id)) ultimaOrdenPorVehiculo.set(o.vehiculo_id, o);
    }
  } else {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from('profiles')
      .select('nombre')
      .eq('id', user!.id)
      .single();
    nombre = profile?.nombre?.trim() || 'cliente';

    const { data: vs } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('cliente_id', user!.id)
      .order('created_at', { ascending: false });
    vehiculos = (vs as Vehiculo[]) ?? [];

    const vehiculoIds = vehiculos.map((v) => v.id);
    const { data: ordenes } = vehiculoIds.length
      ? await supabase
          .from('ordenes')
          .select('*')
          .in('vehiculo_id', vehiculoIds)
          .order('created_at', { ascending: false })
      : { data: [] as Orden[] };
    for (const o of (ordenes ?? []) as Orden[]) {
      if (!ultimaOrdenPorVehiculo.has(o.vehiculo_id)) ultimaOrdenPorVehiculo.set(o.vehiculo_id, o);
    }
  }

  const primerNombre = nombre.split(' ')[0];
  const inicial = primerNombre.charAt(0).toUpperCase() || 'C';
  const total = vehiculos.length;

  return (
    <main className="mx-auto min-h-screen max-w-md animate-riseIn pb-32">
      {demo && <DemoBanner />}
      <div className="hero-crimson rounded-b-[30px] px-[22px] pb-6 pt-14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-saira text-sm text-[#e7b9bc]">Hola, {primerNombre} 👋</span>
            <h1 className="mt-0.5 font-cond text-[34px] font-extrabold tracking-[0.01em]">Mis carros</h1>
          </div>
          <EasterEgg className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/25 bg-white/10 font-cond text-[17px] font-extrabold text-white">
            {inicial}
          </EasterEgg>
        </div>
      </div>

      <div className="px-[18px] pt-4">
        <span className="font-saira text-[13px] text-rivera-dim">
          {total === 0 ? 'Sin vehículos activos' : `${total} ${total === 1 ? 'vehículo activo' : 'vehículos activos'}`}
        </span>
      </div>

      {total === 0 ? (
        <div className="px-[18px] pt-3">
          <div className="card text-center text-rivera-muted">
            Todavía no tienes carros registrados. Cuando ingreses uno al taller, aparecerá aquí.
          </div>
        </div>
      ) : (
        <div className="grid gap-3.5 px-[18px] pb-4 pt-3">
          {(vehiculos as Vehiculo[]).map((v) => {
            const orden = ultimaOrdenPorVehiculo.get(v.id);
            return (
              <TarjetaCarro
                key={v.id}
                id={v.id}
                marca={v.marca}
                modelo={v.modelo}
                anio={v.anio}
                placa={v.placa}
                fotoUrl={v.foto_url}
                etapa={orden?.estatus ?? null}
                fechaEntrega={orden?.fecha_entrega_estimada ?? null}
              />
            );
          })}
        </div>
      )}

      <ClienteTabBar activo="inicio" />
    </main>
  );
}
