export type Notification = {
  id: string
  userId: string
  paymentId: string
  channel: string // Ex: "email", "push", "whatsapp"
  status: string // Ex: "sent", "failed"
  sentAt: string // ISO string format
  errorMessage?: string // Presente somente se falhou
}
