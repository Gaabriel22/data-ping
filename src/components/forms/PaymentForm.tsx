"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paymentSchema } from "@/lib/validators"
import z from "zod"
import { toast } from "sonner"
import axios from "axios"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

type PaymentFormValues = z.infer<typeof paymentSchema>

type PaymentFormProps = {
  defaultValues?: Partial<PaymentFormValues>
  mode?: "create" | "edit"
  paymentId?: string
}

export function PaymentForm({ defaultValues, mode = "create", paymentId }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      amount: defaultValues?.amount ?? "",
      dueDate: defaultValues?.dueDate ?? "",
      status: defaultValues?.status ?? "unpaid",
      notes: defaultValues?.notes ?? "",
      isRecurring: defaultValues?.isRecurring ?? false,
      recurrenceRule: defaultValues?.recurrenceRule ?? "",
      categoryId: defaultValues?.categoryId ?? undefined,
    },
  })

  async function handleFormSubmit(data: PaymentFormValues) {
    try {
      if (mode === "edit" && paymentId) {
        await axios.put(`/api/payments/${paymentId}`, data)
        toast.success("Pagamento atualizado com sucesso!")
      } else {
        await axios.post("/api/payments", data)
        toast.success("Pagamento criado com sucesso!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar pagamento.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 bg-bg text-text p-4 rounded-2xl shadow"
    >
      <div>
        <label className="block text-sm font-medium">Título</label>
        <Input type="text" {...register("title")} className="mt-1 border border-secondary focus:ring-primary" />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Valor</label>
        <Input
          type="text"
          placeholder="Ex: 120.50"
          {...register("amount")}
          className="mt-1 border border-secondary focus:ring-primary"
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Data de Vencimento</label>
        <Input type="date" {...register("dueDate")} className="mt-1 border border-secondary focus:ring-primary" />
        {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          {...register("status")}
          className="mt-1 w-full rounded-md border border-[var(--color-secondary)] bg-[var(--color-bg)] p-2 text-sm focus:ring-[var(--color-primary)]"
        >
          <option value="unpaid">Não Pago</option>
          <option value="paid">Pago</option>
          <option value="overdue">Atrasado</option>
        </select>
        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Notas</label>
        <Textarea
          rows={3}
          {...register("notes")}
          className="mt-1 border border-[var(--color-secondary)] focus:ring-[var(--color-primary)]"
        />
        {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("isRecurring")} className="accent-[var(--color-primary)]" />
        <span className="text-sm">É recorrente?</span>
      </div>

      <div>
        <label className="block text-sm font-medium">Regra de Recorrência (opcional)</label>
        <Input
          type="text"
          {...register("recurrenceRule")}
          className="mt-1 border border-[var(--color-secondary)] focus:ring-[var(--color-primary)]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Categoria (opcional)</label>
        <Input
          type="text"
          {...register("categoryId")}
          className="mt-1 border border-[var(--color-secondary)] focus:ring-[var(--color-primary)]"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="bg-[var(--color-primary)] text-white hover:opacity-90">
        {isSubmitting ? (mode === "edit" ? "Atualizando..." : "Salvando...") : mode === "edit" ? "Atualizar" : "Salvar"}
      </Button>
    </form>
  )
}
