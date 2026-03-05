'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dumpster } from '@/types';
import { dumpstersService } from '@/services/dumpsters.service';
import toast from 'react-hot-toast';

interface Filters {
  serialNumber?: string;
  isRented?: string;
}

export function useDumpsters(initialFilters?: Filters) {
  const [dumpsters, setDumpsters] = useState<Dumpster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters || {});

  const fetchDumpsters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dumpstersService.getAll(filters);
      setDumpsters(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar caçambas';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDumpsters();
  }, [fetchDumpsters]);

  return { dumpsters, loading, error, refetch: fetchDumpsters, setFilters };
}

export function useDumpster(id: string) {
  const [dumpster, setDumpster] = useState<Dumpster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDumpster = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await dumpstersService.getById(id);
      setDumpster(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Caçamba não encontrada';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDumpster();
  }, [fetchDumpster]);

  return { dumpster, loading, error, refetch: fetchDumpster };
}
