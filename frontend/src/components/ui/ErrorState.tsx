import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="card border-red-800/50 flex flex-col items-center text-center py-12 gap-4">
      <AlertTriangle size={32} className="text-red-500" />
      <div>
        <h3 className="text-red-400 font-semibold mb-1">Ocorreu um erro</h3>
        <p className="text-surface-500 text-sm">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-2">
          <RefreshCw size={14} />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
