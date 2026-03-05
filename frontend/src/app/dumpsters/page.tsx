'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, SlidersHorizontal, ShoppingCart, History, Pencil, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useDumpsters } from '@/hooks/useDumpsters';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Dumpster } from '@/types';

type SortKey = 'serialNumber' | 'color' | 'isRented' | '_count';
type SortDir = 'asc' | 'desc';

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={12} className="text-surface-600" />;
  return dir === 'asc'
    ? <ChevronUp size={12} className="text-brand-400" />
    : <ChevronDown size={12} className="text-brand-400" />;
}

export default function DumpstersPage() {
  const [serialFilter, setSerialFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('serialNumber');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const { dumpsters, loading, error, setFilters, refetch } = useDumpsters();

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    return [...dumpsters].sort((a, b) => {
      let valA: string | number | boolean;
      let valB: string | number | boolean;

      if (sortKey === '_count') {
        valA = a._count?.rentals ?? 0;
        valB = b._count?.rentals ?? 0;
      } else if (sortKey === 'isRented') {
        valA = a.isRented ? 1 : 0;
        valB = b.isRented ? 1 : 0;
      } else {
        valA = (a[sortKey] as string).toLowerCase();
        valB = (b[sortKey] as string).toLowerCase();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [dumpsters, sortKey, sortDir]);

  const handleFilter = () => {
    setFilters({
      serialNumber: serialFilter || undefined,
      isRented: statusFilter || undefined,
    });
  };

  const handleClear = () => {
    setSerialFilter('');
    setStatusFilter('');
    setFilters({});
  };

  const th = (key: SortKey, label: string) => (
    <th
      className="table-header text-left px-6 py-4 cursor-pointer select-none hover:text-surface-300 transition-colors"
      onClick={() => handleSort(key)}
    >
      <span className="flex items-center gap-1.5">
        {label}
        <SortIcon active={sortKey === key} dir={sortDir} />
      </span>
    </th>
  );

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="page-title">CAÇAMBAS</h1>
          <p className="text-surface-500 text-sm mt-1">
            {loading ? '—' : `${dumpsters.length} cadastrada${dumpsters.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link href="/dumpsters/new" className="btn-primary">
          <Plus size={16} />
          Cadastrar Caçamba
        </Link>
      </div>

      <div className="card mb-6 w-full">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={14} className="text-brand-400" />
          <span className="text-surface-400 text-xs uppercase tracking-widest font-semibold">Filtros</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Número de Série</label>
            <input
              type="text"
              placeholder="Ex: CAC-001"
              value={serialFilter}
              onChange={(e) => setSerialFilter(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field">
              <option value="">Todos</option>
              <option value="false">Disponível</option>
              <option value="true">Alugada</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={handleFilter} className="btn-primary flex-1">
              <Search size={14} />Filtrar
            </button>
            <button onClick={handleClear} className="btn-secondary px-4 py-3">Limpar</button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Carregando caçambas..." />
      ) : sorted.length === 0 ? (
        <EmptyState
          title="Nenhuma caçamba encontrada"
          description="Cadastre sua primeira caçamba ou ajuste os filtros."
          action={{ label: 'Cadastrar Caçamba', href: '/dumpsters/new' }}
        />
      ) : (
        <div className="card w-full overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr>
                {th('serialNumber', 'Número de Série')}
                {th('color', 'Cor')}
                {th('isRented', 'Status')}
                {th('_count', 'Aluguéis')}
                <th className="table-header text-right px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((dumpster) => (
                <tr key={dumpster.id} className="table-row">
                  <td className="px-6 py-4">
                    <span className="font-mono text-brand-400 font-semibold text-sm">{dumpster.serialNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-surface-600 flex-shrink-0" style={{ backgroundColor: colorToHex(dumpster.color) }} />
                      <span className="text-surface-200 text-sm">{dumpster.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge isRented={dumpster.isRented} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-surface-400 text-sm font-mono">{dumpster._count?.rentals ?? 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dumpsters/${dumpster.id}/edit`}
                        className="flex items-center gap-1 text-surface-400 hover:text-surface-100 text-xs uppercase tracking-wider font-semibold px-2.5 py-1.5 hover:bg-surface-800 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={12} />
                        <span className="hidden sm:inline">Editar</span>
                      </Link>
                      <Link
                        href={`/dumpsters/${dumpster.id}/rent`}
                        className={`flex items-center gap-1 text-xs uppercase tracking-wider font-semibold px-2.5 py-1.5 transition-colors ${
                          dumpster.isRented
                            ? 'text-surface-600 cursor-not-allowed pointer-events-none'
                            : 'text-brand-400 hover:bg-brand-400/10'
                        }`}
                        title={dumpster.isRented ? 'Já alugada' : 'Alugar'}
                      >
                        <ShoppingCart size={12} />
                        <span className="hidden sm:inline">Alugar</span>
                      </Link>
                      <Link
                        href={`/dumpsters/${dumpster.id}/history`}
                        className="flex items-center gap-1 text-surface-400 hover:text-surface-100 text-xs uppercase tracking-wider font-semibold px-2.5 py-1.5 hover:bg-surface-800 transition-colors"
                        title="Histórico"
                      >
                        <History size={12} />
                        <span className="hidden sm:inline">Histórico</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function colorToHex(color: string): string {
  const map: Record<string, string> = {
    amarela: '#facc15', amarelo: '#facc15',
    azul: '#3b82f6', verde: '#22c55e',
    vermelha: '#ef4444', vermelho: '#ef4444',
    laranja: '#f97316', branca: '#f8fafc',
    branco: '#f8fafc', cinza: '#6b7280',
    preta: '#1f2937', preto: '#1f2937',
  };
  return map[color.toLowerCase()] ?? '#9a8670';
}
