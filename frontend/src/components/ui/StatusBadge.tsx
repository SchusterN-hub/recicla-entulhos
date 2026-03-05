import { Circle } from 'lucide-react';

interface StatusBadgeProps {
  isRented: boolean;
}

export function StatusBadge({ isRented }: StatusBadgeProps) {
  return isRented ? (
    <span className="badge-rented">
      <Circle size={6} className="fill-brand-400" />
      Alugada
    </span>
  ) : (
    <span className="badge-available">
      <Circle size={6} className="fill-emerald-400" />
      Disponível
    </span>
  );
}
