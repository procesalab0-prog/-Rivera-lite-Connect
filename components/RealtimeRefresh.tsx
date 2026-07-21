'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Se suscribe a cambios de ordenes/avances y refresca la vista en vivo.
export default function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const canal = supabase
      .channel('cambios-taller')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes' }, () =>
        router.refresh()
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'avances' }, () =>
        router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [router]);

  return null;
}
