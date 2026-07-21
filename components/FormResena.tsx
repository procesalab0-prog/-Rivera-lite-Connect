'use client';

import { useState } from 'react';
import { enviarResena } from '@/app/carro/[id]/actions';
import type { Resena } from '@/lib/types';

// Formulario de calificación (solo cuando la orden está entregada).
export default function FormResena({
  ordenId,
  existente,
}: {
  ordenId: string;
  existente: Resena | null;
}) {
  const [calificacion, setCalificacion] = useState(existente?.calificacion ?? 5);

  return (
    <form action={enviarResena} className="space-y-3">
      <input type="hidden" name="orden_id" value={ordenId} />
      <input type="hidden" name="calificacion" value={calificacion} />
      <div className="flex gap-1 text-2xl">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setCalificacion(n)}
            aria-label={`${n} estrellas`}
            className={n <= calificacion ? 'text-rivera-gold' : 'text-slate-600'}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        name="comentario"
        rows={3}
        placeholder="¿Cómo fue tu experiencia?"
        defaultValue={existente?.comentario ?? ''}
        className="input"
      />
      <button className="btn-primary">
        {existente ? 'Actualizar reseña' : 'Enviar reseña'}
      </button>
    </form>
  );
}
