'use client';

export default function BotonImprimir() {
  return (
    <button onClick={() => window.print()} className="btn-primary w-full print:hidden">
      Descargar / Imprimir
    </button>
  );
}
