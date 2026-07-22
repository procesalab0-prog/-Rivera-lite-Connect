'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Muestra el código QR que apunta a la vista pública /qr/[slug].
export default function QRCarro({ slug }: { slug: string }) {
  const [dataUrl, setDataUrl] = useState<string>('');

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : '');
  const url = `${base}/qr/${slug}`;

  useEffect(() => {
    QRCode.toDataURL(url, { width: 220, margin: 1 })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-3">
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt="Código QR del carro" className="rounded-[14px] bg-[#EDE8DE] p-4" />
      ) : (
        <div className="h-[188px] w-[188px] animate-pulse rounded-[14px] bg-rivera-input" />
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-center font-saira text-xs text-rivera-muted hover:text-rivera-red"
      >
        {url}
      </a>
    </div>
  );
}
