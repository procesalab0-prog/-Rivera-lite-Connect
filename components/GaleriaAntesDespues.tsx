import type { Foto } from '@/lib/types';

// Galería de fotos: par Antes / Después + fotos "durante el proceso".
export default function GaleriaAntesDespues({ fotos }: { fotos: Foto[] }) {
  const antes = fotos.find((f) => f.tipo === 'antes');
  const despues = fotos.find((f) => f.tipo === 'despues');
  const durante = fotos.filter((f) => f.tipo === 'durante');

  if (fotos.length === 0) {
    return <p className="font-sans text-sm text-rivera-dim">Aún no hay fotos.</p>;
  }

  return (
    <div>
      {(antes || despues) && (
        <div className="grid grid-cols-2 gap-2.5">
          <Slot foto={antes} etiqueta="Antes" destacado={false} />
          <Slot foto={despues} etiqueta="Después" destacado />
        </div>
      )}

      {durante.length > 0 && (
        <>
          <h4 className="mb-2.5 mt-4 font-cond text-xs font-semibold uppercase tracking-[0.1em] text-rivera-dim">
            Durante el proceso
          </h4>
          <div className="grid grid-cols-3 gap-2.5">
            {durante.map((f) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={f.id}
                src={f.url}
                alt={f.descripcion ?? 'Foto del proceso'}
                className="aspect-square w-full rounded-xl border border-rivera-input-border object-cover"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Slot({
  foto,
  etiqueta,
  destacado,
}: {
  foto: Foto | undefined;
  etiqueta: string;
  destacado: boolean;
}) {
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-[14px] border"
      style={{ borderColor: destacado ? 'rgba(228,18,30,.4)' : '#2a2e36' }}
    >
      {foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={foto.url} alt={etiqueta} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-rivera-input font-saira text-xs text-rivera-dim">
          Sin foto
        </div>
      )}
      <span
        className="absolute left-2 top-2 rounded-md px-2 py-0.5 font-cond text-[10px] font-bold uppercase tracking-[0.1em] text-white"
        style={
          destacado
            ? { background: 'rgba(228,18,30,.85)' }
            : { background: 'rgba(8,9,11,.7)', border: '1px solid #2a2e36' }
        }
      >
        {etiqueta}
      </span>
    </div>
  );
}
