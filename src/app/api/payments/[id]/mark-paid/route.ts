import { auth } from "@/lib/auth"
import { Payment } from "@/types/Payment"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
    }

    const { id } = params

    const payment = await prisma?.payment.findUnique({
      where: { id },
    })

    if (!payment || payment.userId !== userId) {
      return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 })
    }

    const updated = await prisma?.payment.update({
      where: { id },
      data: { status: "paid" },
    })

    if (!payment) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
    }

    const response: Payment = {
      ...payment,
      amount: payment.amount.toString(),
      status: payment.status as "paid" | "unpaid" | "overdue",
      dueDate: payment.dueDate.toISOString(),
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      categoryId: payment.categoryId ?? undefined,
      notes: payment.notes ?? undefined,
      recurrenceRule: payment.recurrenceRule ?? undefined,
      nextDueDate: payment.nextDueDate?.toISOString(),
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
