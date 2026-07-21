'use client';

import { useState } from 'react';
import type { Foto } from '@/lib/types';

// Galería de fotos con comparador antes/después (slider).
export default function GaleriaAntesDespues({ fotos }: { fotos: Foto[] }) {
  const antes = fotos.filter((f) => f.tipo === 'antes');
  const despues = fotos.filter((f) => f.tipo === 'despues');
  const durante = fotos.filter((f) => f.tipo === 'durante');

  const parAntes = antes[0];
  const parDespues = despues[0];

  return (
    <div className="space-y-6">
      {parAntes && parDespues && (
        <Comparador antes={parAntes.url} despues={parDespues.url} />
      )}

      {durante.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-300">
            Durante el proceso
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {durante.map((f) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={f.id}
                src={f.url}
                alt={f.descripcion ?? 'Foto del proceso'}
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {fotos.length === 0 && (
        <p className="text-sm text-slate-500">Aún no hay fotos.</p>
      )}
    </div>
  );
}

function Comparador({ antes, despues }: { antes: string; despues: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div>
      <h4 className="mb-2 text-sm font-medium text-slate-300">
        Antes / Después
      </h4>
      <div className="relative aspect-video w-full select-none overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={despues}
          alt="Después"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={antes}
            alt="Antes"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ maxWidth: 'none', width: '100vw' }}
          />
        </div>
        <div
          className="absolute top-0 h-full w-0.5 bg-rivera-gold"
          style={{ left: `${pos}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="mt-2 w-full accent-rivera-gold"
        aria-label="Comparar antes y después"
      />
    </div>
  );
}
