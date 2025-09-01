import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { currentUser } from "@/lib/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const userSettingsSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  timezone: z.string().min(2, "Timezone inválido."),
})

type UserSettingsFormValues = z.infer<typeof userSettingsSchema>

type CustomPublicMetadata = {
  timezone?: string
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [initialDate, setInitialDate] = useState<UserSettingsFormValues | null>(
    null
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsSchema),
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await currentUser()
        if (user) {
          const metadata = user.publicMetadata as CustomPublicMetadata

          const data: UserSettingsFormValues = {
            name: user.firstName || "",
            timezone: metadata.timezone || "",
          }
          setInitialDate(data)
          reset(data)
        }
      } catch (error) {
        console.error(error)
        toast.error("Erro ao carregar dados do usuário")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [reset])

  const onSubmit = async (data: UserSettingsFormValues) => {
    try {
      await axios.put("/api/users/settings", data)
      toast.success("Perfil atualizado com sucesso!")
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error || "Erro ao atualizar perfil")
    }
  }

  if (loading) return <p>Carregando...</p>

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configurações do Usuário</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-bg text-text p-6 rounded-2xl shadow"
      >
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <Input
            type="text"
            {...register("name")}
            className="mt-1 border border-secondary focus:ring-primary"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Timezone</label>
          <Input
            type="text"
            {...register("timezone")}
            className="mt-1 border border-secondary focus:ring-primary"
          />
          {errors.timezone && (
            <p className="text-sm text-red-500">{errors.timezone.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-text hover:opacity-90 mt-2"
        >
          {isSubmitting ? "Atualizando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  )
}
