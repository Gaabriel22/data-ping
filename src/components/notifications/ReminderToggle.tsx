import { useState } from "react"
import { toast } from "sonner"
import { Switch } from "../ui/switch"

type ReminderToggleProps = {
  paymentId: string
  active?: boolean
}

export function ReminderToggle({ paymentId, active = false }: ReminderToggleProps) {
  const [checked, setChecked] = useState(active)
  const [loading, setLoading] = useState(false)

  const toggleReminder = async () => {
    setLoading(true)
    try {
      // Chamada da API no futuro
      // Exemplo:
      // if (checked) {
      //   await axios.delete(`/api/reminders/${paymentId}`)
      // } else {
      //   await axios.post("/api/reminders", { paymentId, daysBefore: 1, hour: new Date().toISOString() })
      // }

      setChecked(!checked)
      toast.success(`Lembrete ${!checked ? "ativado" : "desativado"}!`)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao atualizar lembrete.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={toggleReminder}
        disabled={loading}
        className="bg-secondary data-[state=checked]:bg-primary"
      />
      <span className="text-sm text-text">{checked ? "Lembrete Ativo" : "Lembrete Inativo"}</span>
    </div>
  )
}
