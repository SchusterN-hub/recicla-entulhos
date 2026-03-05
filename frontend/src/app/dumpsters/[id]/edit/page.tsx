"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, ShoppingCart, History } from "lucide-react";
import toast from "react-hot-toast";
import { useDumpster } from "@/hooks/useDumpsters";
import { dumpstersService } from "@/services/dumpsters.service";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const schema = z.object({
  serialNumber: z.string().min(3).max(50),
  color: z.string().min(2).max(30),
});

type FormData = z.infer<typeof schema>;

export default function EditDumpsterPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { dumpster, loading, error } = useDumpster(params.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (dumpster) {
      reset({ serialNumber: dumpster.serialNumber, color: dumpster.color });
    }
  }, [dumpster, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await dumpstersService.update(params.id, data);
      toast.success("Caçamba atualizada com sucesso!");
      router.push("/dumpsters");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao atualizar caçamba",
      );
    }
  };

  if (loading) return <LoadingSpinner text="Carregando caçamba..." />;
  if (error)
    return (
      <div className="card border-red-800">
        <p className="text-red-400">{error}</p>
        <Link href="/dumpsters" className="btn-secondary mt-4 inline-flex">
          Voltar
        </Link>
      </div>
    );
  if (!dumpster) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dumpsters"
          className="text-surface-500 hover:text-brand-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">EDITAR CAÇAMBA</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-brand-400 text-sm">
              {dumpster.serialNumber}
            </span>
            <StatusBadge isRented={dumpster.isRented} />
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">Número de Série *</label>
            <input
              {...register("serialNumber")}
              type="text"
              className="input-field"
            />
            {errors.serialNumber && (
              <p className="text-red-400 text-xs mt-1">
                {errors.serialNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">Cor *</label>
            <input {...register("color")} type="text" className="input-field" />
            {errors.color && (
              <p className="text-red-400 text-xs mt-1">
                {errors.color.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-surface-950/30 border-t-surface-950 rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} />
                Salvar Alterações
              </>
            )}
          </button>
        </form>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/dumpsters/${params.id}/rent`}
          className={`btn-primary justify-center ${dumpster.isRented ? "opacity-40 pointer-events-none" : ""}`}
        >
          <ShoppingCart size={16} />
          {dumpster.isRented ? "Já Alugada" : "Alugar"}
        </Link>
        <Link
          href={`/dumpsters/${params.id}/history`}
          className="btn-secondary justify-center"
        >
          <History size={16} />
          Ver Histórico
        </Link>
      </div>

      {dumpster.isRented && (
        <p className="text-surface-500 text-xs mt-3 text-center">
          Esta caçamba está alugada no momento. Finalize o aluguel atual para
          poder alugar novamente.
        </p>
      )}
    </div>
  );
}
