import Link from 'next/link';
import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center text-center py-16 gap-4">
      <div className="w-12 h-12 border border-surface-700 flex items-center justify-center">
        <PackageSearch size={24} className="text-surface-500" />
      </div>
      <div>
        <h3 className="text-surface-300 font-semibold mb-1">{title}</h3>
        {description && <p className="text-surface-500 text-sm">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn-primary mt-2">
          {action.label}
        </Link>
      )}
    </div>
  );
}
