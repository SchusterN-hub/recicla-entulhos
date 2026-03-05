'use client';

import { useState, useEffect, useCallback } from 'react';
import { Rental } from '@/types';
import { dumpstersService } from '@/services/dumpsters.service';

export function useRentalHistory(dumpsterId: string) {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!dumpsterId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await dumpstersService.getRentals(dumpsterId);
      setRentals(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar histórico';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [dumpsterId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { rentals, loading, error, refetch: fetchHistory };
}
