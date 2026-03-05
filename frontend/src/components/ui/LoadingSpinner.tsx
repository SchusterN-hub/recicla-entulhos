interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text = 'Carregando...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-8 h-8 border-2 border-surface-700 border-t-brand-400 rounded-full animate-spin" />
      <p className="text-surface-500 text-sm uppercase tracking-widest">{text}</p>
    </div>
  );
}
