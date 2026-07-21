'use client';

export default function BotonImprimir() {
  return (
    <button onClick={() => window.print()} className="btn-primary print:hidden">
      Imprimir / Guardar PDF
    </button>
  );
}
