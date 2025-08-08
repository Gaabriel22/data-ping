export type Payment = {
  id: string
  userId: string
  categoryId?: string
  title: string
  amount: string // Prisma Decimal convertido para string
  dueDate: string // ISO format
  status: "paid" | "unpaid" | "overdue" 
  notes?: string
  isRecurring: boolean
  recurrenceRule?: string
  nextDueDate?: string
  createdAt: string
  updatedAt: string
}
