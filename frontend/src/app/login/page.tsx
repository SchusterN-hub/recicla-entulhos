'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await authService.login(data);
      document.cookie = 'recicla_auth=true; path=/; max-age=86400; SameSite=Lax';
      toast.success(`Bem-vindo, ${result.user.name}!`);
      router.push('/dumpsters');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 stripe-bg border-r border-surface-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-400/5 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-brand-400 flex items-center justify-center">
              <span className="text-surface-950 font-black text-xs">RE</span>
            </div>
            <span className="text-surface-400 uppercase tracking-widest text-xs font-semibold">Recicla Entulhos</span>
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-7xl text-surface-50 leading-none mb-4">
            GESTÃO<br /><span className="text-brand-400">DE</span><br />CAÇAMBAS
          </h1>
          <p className="text-surface-400 max-w-sm leading-relaxed">
            Controle completo do ciclo de locação de caçambas para descarte de resíduos de construção civil.
          </p>
        </div>
        <div className="relative z-10 flex gap-8">
          {[{ num: '100%', label: 'Digital' }, { num: 'Real-time', label: 'Status' }, { num: 'Histórico', label: 'Completo' }].map((s) => (
            <div key={s.label}>
              <div className="text-brand-400 text-xl font-bold font-mono">{s.num}</div>
              <div className="text-surface-500 text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-6 h-6 bg-brand-400 flex items-center justify-center">
              <span className="text-surface-950 font-black text-xs">RE</span>
            </div>
            <span className="text-surface-400 uppercase tracking-widest text-xs font-semibold">Recicla Entulhos</span>
          </div>

          <h2 className="page-title mb-1">ENTRAR</h2>
          <p className="text-surface-500 text-sm mb-8">Acesse o painel de controle</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input {...register('email')} type="email" placeholder="admin@recicla.com" className="input-field" autoComplete="email" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Senha</label>
              <input {...register('password')} type="password" placeholder="••••••••" className="input-field" autoComplete="current-password" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="pt-2">
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? (
                  <><span className="inline-block w-4 h-4 border-2 border-surface-950/30 border-t-surface-950 rounded-full animate-spin" />Entrando...</>
                ) : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-8 p-3 border border-surface-800 bg-surface-900">
            <p className="text-surface-500 text-xs uppercase tracking-widest mb-1 font-semibold">Acesso padrão</p>
            <p className="text-surface-400 text-sm font-mono">admin@recicla.com</p>
            <p className="text-surface-400 text-sm font-mono">recicla123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
