import { Reminder, Subscription } from "@prisma/client"

export type User = {
  id: string
  name: string
  email: string
  timezone: string
  createdAt: string
  updatedAt: string

  // Relacionamentos opcionais (usados no dashboard, configs, etc.)
  reminder?: Reminder
  subscription?: Subscription
}
