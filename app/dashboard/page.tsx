import { createClient } from '@/lib/supabase/server';
import NavBar from '@/components/NavBar';
import TarjetaCarro from '@/components/TarjetaCarro';
import type { Orden, Vehiculo } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol, nombre')
    .eq('id', user!.id)
    .single();

  const { data: vehiculos } = await supabase
    .from('vehiculos')
    .select('*')
    .eq('cliente_id', user!.id)
    .order('created_at', { ascending: false });

  const vehiculoIds = (vehiculos ?? []).map((v) => v.id);

  // Última orden por vehículo (para etapa y fecha de entrega)
  const { data: ordenes } = vehiculoIds.length
    ? await supabase
        .from('ordenes')
        .select('*')
        .in('vehiculo_id', vehiculoIds)
        .order('created_at', { ascending: false })
    : { data: [] as Orden[] };

  const ultimaOrdenPorVehiculo = new Map<string, Orden>();
  for (const o of (ordenes ?? []) as Orden[]) {
    if (!ultimaOrdenPorVehiculo.has(o.vehiculo_id)) {
      ultimaOrdenPorVehiculo.set(o.vehiculo_id, o);
    }
  }

  return (
    <>
      <NavBar rol={(profile?.rol as 'cliente') ?? 'cliente'} nombre={profile?.nombre ?? null} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Mis carros</h1>

        {(vehiculos ?? []).length === 0 ? (
          <div className="card text-center text-slate-400">
            Todavía no tienes carros registrados. Cuando ingreses uno al taller,
            aparecerá aquí.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
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
      </main>
    </>
  );
}
