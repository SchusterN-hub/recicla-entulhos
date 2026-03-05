"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { dumpstersService } from "@/services/dumpsters.service";

const schema = z.object({
  serialNumber: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres"),
  color: z.string().min(2, "Informe a cor").max(30, "Máximo 30 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function NewDumpsterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await dumpstersService.create(data);
      toast.success("Caçamba cadastrada com sucesso!");
      router.push("/dumpsters");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao cadastrar caçamba",
      );
    }
  };

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
          <h1 className="page-title">NOVA CAÇAMBA</h1>
          <p className="text-surface-500 text-sm mt-1">
            Preencha os dados da caçamba
          </p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">Número de Série *</label>
            <input
              {...register("serialNumber")}
              type="text"
              placeholder="Ex: CAC-001"
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
            <input
              {...register("color")}
              type="text"
              placeholder="Ex: Amarela"
              className="input-field"
            />
            {errors.color && (
              <p className="text-red-400 text-xs mt-1">
                {errors.color.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-surface-950/30 border-t-surface-950 rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Salvar
                </>
              )}
            </button>
            <Link href="/dumpsters" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
