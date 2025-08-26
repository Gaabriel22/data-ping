"use client"
import { categorySchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

type CategoryFormValues = z.infer<typeof categorySchema>

type CategoryFormProps = {
  defaultValues?: Partial<CategoryFormValues>
  mode?: "create" | "edit"
  categoryId?: string
}
export function CategoryForm({ defaultValues, mode = "create", categoryId }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      color: defaultValues?.color ?? "",
    },
  })

  async function handleFormSubmit(data: CategoryFormValues) {
    try {
      if (mode === "edit" && categoryId) {
        await axios.put(`/api/categories/${categoryId}`, data)
        toast.success("Categoria atualizada com sucesso!")
      } else {
        await axios.post("/api/categories", data)
        toast.success("Categoria criada com sucesso!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar categoria.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 bg-bg text-text p-4 rounded-2xl shadow"
    >
      <div>
        <label className="block text-sm font-medium">Nome</label>
        <Input type="text" {...register("name")} className="mt-1 border border-secondary focus:ring-primary" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Cor (opcional)</label>
        <Input
          type="color"
          {...register("color")}
          className="mt-1 w-16 h-10 p-10 border-none rounded-md cursor-pointer"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="bg-primary text-text hover:opacity-90">
        {isSubmitting ? (mode === "edit" ? "Atualizando..." : "Salvando...") : mode === "edit" ? "Atualizar" : "Salvar"}
      </Button>
    </form>
  )
}
