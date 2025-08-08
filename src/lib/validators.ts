import { z } from "zod"

// --------------------------
// 🔐 Auth
// --------------------------

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  timezone: z.string(),
})

// --------------------------
// 💸 Payment
// --------------------------

export const paymentSchema = z.object({
  title: z.string().min(2),
  amount: z.number().positive(),
  dueDate: z.coerce.date(),
  status: z.enum(["pendente", "pago"]),
  notes: z.string().optional().nullable(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
})

// --------------------------
// 🗂️ Category
// --------------------------

export const categorySchema = z.object({
  name: z.string().min(2),
  color: z.string().optional().nullable(),
})

// --------------------------
// ⏰ Reminder
// --------------------------

export const reminderSchema = z.object({
  daysBefore: z.number().min(0).max(30),
  hour: z.coerce.date(),
  viaEmail: z.boolean().default(true),
  viaPush: z.boolean().default(false),
  viaWhatsapp: z.boolean().default(false),
  active: z.boolean().default(true),
})

// --------------------------
// 📣 Notification (apenas leitura)
// --------------------------

export const notificationSchema = z.object({
  channel: z.string(),
  status: z.enum(["enviado", "erro"]),
  sentAt: z.coerce.date(),
  errorMessage: z.string().optional().nullable(),
})

// --------------------------
// 💳 Subscription
// --------------------------

export const subscriptionSchema = z.object({
  plan: z.enum(["free", "pro", "premium"]),
  stripeId: z.string(),
  status: z.enum(["active", "canceled", "past_due"]),
  renewsAt: z.coerce.date(),
})
