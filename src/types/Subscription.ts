export type Subscription = {
  id: string
  userId: string
  plan: string // Ex: "free", "pro", "premium"
  stripeId: string // ID da assinatura no Stripe
  status: string // Ex: "active", "canceled", "past_due"
  renewsAt: string // ISO date string (DateTime)
  createdAt: string // ISO date string (DateTime)
}
