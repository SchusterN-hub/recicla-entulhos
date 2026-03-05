"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  Loader,
  CalendarClock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDumpster } from "@/hooks/useDumpsters";
import { rentalsService, viaCepService } from "@/services/rentals.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const todayStr = () => new Date().toISOString().split("T")[0];

const schema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato: 00000-000)"),
  street: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  expectedEndDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return new Date(val) >= new Date(todayStr());
      },
      { message: "A data prevista não pode ser anterior a hoje" },
    ),
});

type FormData = z.infer<typeof schema>;

export default function RentDumpsterPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { dumpster, loading } = useDumpster(params.id);
  const [cepLoading, setCepLoading] = useState(false);
  const [addressFetched, setAddressFetched] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const cepValue = watch("cep");

  const fetchCep = async () => {
    const cep = cepValue?.replace(/\D/g, "");
    if (!cep || cep.length !== 8) return;
    setCepLoading(true);
    try {
      const address = await viaCepService.fetchAddress(cep);
      setValue("street", address.logradouro || "");
      setValue("neighborhood", address.bairro || "");
      setValue("city", `${address.localidade}/${address.uf}`);
      setAddressFetched(true);
    } catch {
      toast.error("CEP não encontrado");
      setAddressFetched(false);
    } finally {
      setCepLoading(false);
    }
  };

  const onSubmit = async (formData: FormData) => {
    if (!dumpster) return;
    try {
      await rentalsService.create({
        dumpsterId: dumpster.id,
        cep: formData.cep,
        expectedEndDate: formData.expectedEndDate || undefined,
      });
      toast.success("Caçamba alugada com sucesso!");
      router.push("/dumpsters");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao registrar aluguel",
      );
    }
  };

  if (loading) return <LoadingSpinner text="Carregando caçamba..." />;
  if (!dumpster) return null;

  if (dumpster.isRented) {
    return (
      <div className="w-full">
        <div className="card border-brand-400/20">
          <p className="text-surface-400 text-sm mb-4">
            A caçamba{" "}
            <strong className="text-brand-400">{dumpster.serialNumber}</strong>{" "}
            já está alugada. Finalize o aluguel atual antes de registrar um
            novo.
          </p>
          <Link
            href={`/dumpsters/${params.id}/edit`}
            className="btn-secondary inline-flex"
          >
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/dumpsters/${params.id}/edit`}
          className="text-surface-500 hover:text-brand-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">ALUGAR CAÇAMBA</h1>
          <p className="text-surface-500 text-sm mt-1">
            Registre o endereço e período de entrega
          </p>
        </div>
      </div>

      <div className="card mb-4 border-brand-400/20">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="label">Número de Série</span>
            <span className="font-mono text-brand-400 font-semibold block">
              {dumpster.serialNumber}
            </span>
          </div>
          <div>
            <span className="label">Cor</span>
            <span className="text-surface-200 block">{dumpster.color}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* CEP section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} className="text-brand-400" />
              <span className="text-surface-400 text-xs uppercase tracking-widest font-semibold">
                Endereço de Entrega
              </span>
            </div>

            <div className="mb-4">
              <label className="label">CEP *</label>
              <div className="flex gap-2">
                <input
                  {...register("cep")}
                  type="text"
                  placeholder="00000-000"
                  className="input-field flex-1"
                  onBlur={() => {
                    const cep = cepValue?.replace(/\D/g, "");
                    if (cep?.length === 8) fetchCep();
                  }}
                  maxLength={9}
                />
                <button
                  type="button"
                  onClick={fetchCep}
                  disabled={cepLoading}
                  className="btn-secondary px-4"
                >
                  {cepLoading ? (
                    <Loader size={14} className="animate-spin" />
                  ) : (
                    <MapPin size={14} />
                  )}
                </button>
              </div>
              {errors.cep && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.cep.message}
                </p>
              )}
              {addressFetched && (
                <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle size={10} /> Endereço preenchido automaticamente
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="label">Logradouro</label>
                <input
                  {...register("street")}
                  type="text"
                  placeholder="Preenchível via CEP"
                  className="input-field bg-surface-800/50"
                />
              </div>
              <div>
                <label className="label">Bairro</label>
                <input
                  {...register("neighborhood")}
                  type="text"
                  placeholder="Preenchível via CEP"
                  className="input-field bg-surface-800/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Cidade</label>
                <input
                  {...register("city")}
                  type="text"
                  placeholder="Preenchível via CEP"
                  className="input-field bg-surface-800/50"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-surface-800 pt-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock size={14} className="text-brand-400" />
              <span className="text-surface-400 text-xs uppercase tracking-widest font-semibold">
                Período
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Data de Início</label>
                <input
                  type="date"
                  value={todayStr()}
                  className="input-field bg-surface-800/50 text-surface-500"
                  readOnly
                  disabled
                />
                <p className="text-surface-600 text-xs mt-1">
                  Definida automaticamente como hoje
                </p>
              </div>
              <div>
                <label className="label">Previsão de Devolução</label>
                <input
                  {...register("expectedEndDate")}
                  type="date"
                  min={todayStr()}
                  className="input-field"
                />
                {errors.expectedEndDate && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.expectedEndDate.message}
                  </p>
                )}
                <p className="text-surface-600 text-xs mt-1">
                  Opcional — será destacada se vencida
                </p>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting || !addressFetched}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-surface-950/30 border-t-surface-950 rounded-full animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Confirmar Aluguel
                </>
              )}
            </button>
            {!addressFetched && (
              <p className="text-surface-500 text-xs mt-2 text-center">
                Consulte o CEP para habilitar a confirmação
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
