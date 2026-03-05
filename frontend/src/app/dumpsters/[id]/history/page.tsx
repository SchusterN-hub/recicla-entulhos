'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDumpster } from '@/hooks/useDumpsters';
import { useRentalHistory } from '@/hooks/useRentals';
import { rentalsService } from '@/services/rentals.service';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Rental } from '@/types';

type SortKey = 'startDate' | 'expectedEndDate' | 'endDate' | 'cep' | 'city';
type SortDir = 'asc' | 'desc';

type RentalStatus = 'completed' | 'overdue' | 'active' | 'no-date';

function getRentalStatus(rental: Rental): RentalStatus {
  if (rental.endDate) return 'completed';
  if (!rental.expectedEndDate) return 'no-date';
  const expected = new Date(rental.expectedEndDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expected < today ? 'overdue' : 'active';
}

function StatusCell({ rental }: { rental: Rental }) {
  const status = getRentalStatus(rental);

  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest px-2.5 py-1">
        <CheckCircle size={10} />Concluído
      </span>
    );
  }
  if (status === 'overdue') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest px-2.5 py-1 animate-pulse">
        <AlertTriangle size={10} />Atrasado
      </span>
    );
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-brand-400/10 border border-brand-400/30 text-brand-400 text-xs font-bold uppercase tracking-widest px-2.5 py-1">
        <Clock size={10} />Em andamento
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-surface-700/30 border border-surface-700 text-surface-500 text-xs font-bold uppercase tracking-widest px-2.5 py-1">
      <Clock size={10} />Em andamento
    </span>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={12} className="text-surface-600" />;
  return dir === 'asc' ? <ChevronUp size={12} className="text-brand-400" /> : <ChevronDown size={12} className="text-brand-400" />;
}

export default function HistoryPage({ params }: { params: { id: string } }) {
  const { dumpster, loading: dumpsterLoading } = useDumpster(params.id);
  const { rentals, loading, error, refetch } = useRentalHistory(params.id);
  const [finishingId, setFinishingId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('startDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = useMemo(() => {
    return [...rentals].sort((a, b) => {
      const valA = ((a as any)[sortKey] ?? '') as string;
      const valB = ((b as any)[sortKey] ?? '') as string;
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rentals, sortKey, sortDir]);

  const overdueCount = rentals.filter((r) => getRentalStatus(r) === 'overdue').length;

  const handleFinish = async (rentalId: string) => {
    if (!confirm('Deseja finalizar este aluguel?')) return;
    setFinishingId(rentalId);
    try {
      await rentalsService.finish(rentalId);
      toast.success('Aluguel finalizado!');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao finalizar aluguel');
    } finally {
      setFinishingId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatDateOnly = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  if (dumpsterLoading || loading) return <LoadingSpinner text="Carregando histórico..." />;

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/dumpsters/${params.id}/edit`} className="text-surface-500 hover:text-brand-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">HISTÓRICO DE ALUGUÉIS</h1>
          {dumpster && (
            <p className="text-surface-500 text-sm mt-1">
              <span className="font-mono text-brand-400">{dumpster.serialNumber}</span>
              {' · '}{dumpster.color}
              {' · '}{rentals.length} registro{rentals.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {overdueCount > 0 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">
            <strong>{overdueCount}</strong> aluguel{overdueCount > 1 ? 's' : ''} com prazo vencido aguardando devolução.
          </p>
        </div>
      )}

      {error && <p className="text-red-400 card mb-4">{error}</p>}

      {sorted.length === 0 ? (
        <EmptyState title="Nenhum aluguel registrado" description="Esta caçamba ainda não foi alugada." />
      ) : (
        <div className="card w-full overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr>
                {th('startDate', 'Início')}
                {th('expectedEndDate', 'Previsão')}
                {th('endDate', 'Devolução')}
                <th className="table-header text-left px-6 py-4">Situação</th>
                {th('cep', 'CEP')}
                <th className="table-header text-left px-6 py-4">Endereço</th>
                {th('city', 'Cidade')}
                <th className="table-header text-right px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((rental) => {
                const status = getRentalStatus(rental);
                const isOverdue = status === 'overdue';

                return (
                  <tr key={rental.id} className={`table-row ${isOverdue ? 'bg-red-500/5' : ''}`}>
                    <td className="px-6 py-4">
                      <span className="text-surface-300 text-sm font-mono whitespace-nowrap">{formatDate(rental.startDate)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {rental.expectedEndDate ? (
                        <span className={`text-sm font-mono whitespace-nowrap ${isOverdue ? 'text-red-400 font-bold' : 'text-surface-300'}`}>
                          {formatDateOnly(rental.expectedEndDate)}
                        </span>
                      ) : (
                        <span className="text-surface-600 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-surface-400 text-sm font-mono whitespace-nowrap">{formatDate(rental.endDate)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusCell rental={rental} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-surface-300 text-sm">{rental.cep}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-surface-300 text-sm block">{rental.street}</span>
                        <span className="text-surface-500 text-xs">{rental.neighborhood}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-surface-300 text-sm whitespace-nowrap">{rental.city}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!rental.endDate ? (
                        <button
                          onClick={() => handleFinish(rental.id)}
                          disabled={finishingId === rental.id}
                          className={`text-xs px-3 py-1.5 flex items-center gap-1.5 ml-auto border font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                            isOverdue
                              ? 'bg-red-700/30 border-red-600 text-red-400 hover:bg-red-700/50'
                              : 'bg-red-700/20 border-red-700 text-red-400 hover:bg-red-700/40'
                          }`}
                        >
                          {finishingId === rental.id ? (
                            <span className="inline-block w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          ) : <CheckCircle size={12} />}
                          Finalizar
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest px-2.5 py-1">
                          <CheckCircle size={10} />OK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
