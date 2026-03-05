'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { LogOut } from 'lucide-react';

export default function DumpstersLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'recicla_auth=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <header className="border-b border-surface-800 bg-surface-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="w-full px-6 h-14 flex items-center justify-between">
          <Link href="/dumpsters" className="flex items-center gap-3 group">
            <div className="w-7 h-7 bg-brand-400 flex items-center justify-center group-hover:bg-brand-300 transition-colors">
              <span className="text-surface-950 font-black text-xs">RE</span>
            </div>
            <div>
              <span className="text-surface-100 font-bold text-sm uppercase tracking-wider">Recicla Entulhos</span>
              <span className="hidden sm:inline text-surface-600 text-xs ml-2">/ Gestão de Caçambas</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/dumpsters" className="text-surface-400 hover:text-surface-100 text-sm px-3 py-1.5 uppercase tracking-wider font-semibold transition-colors hover:bg-surface-800">
              Caçambas
            </Link>
            <button
              onClick={handleLogout}
              className="text-surface-500 hover:text-red-400 text-sm px-3 py-1.5 uppercase tracking-wider font-semibold transition-colors hover:bg-surface-800 flex items-center gap-1.5"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-6 py-8">
        {children}
      </main>
    </div>
  );
}
