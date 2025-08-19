import { auth } from "@/lib/auth"
import { paymentSchema } from "@/lib/validators"
import { Payment } from "@/types/Payment"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const payments = await prisma?.payment.findMany({
    where: { userId },
    orderBy: { dueDate: "asc" },
  })

  return NextResponse.json(
    payments?.map((p) => ({
      ...p,
      amount: p.amount.toString(),
      dueDate: p.dueDate.toISOString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      nextDueDate: p.nextDueDate ? p.nextDueDate.toISOString() : null,
    })) as Payment[]
  )
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = paymentSchema.parse(body)

    const payment = await prisma?.payment.create({
      data: {
        ...data,
        userId,
      },
    })

    if (!payment) {
      throw new Error("Pagamento não encontrado")
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

    return NextResponse.json(response, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
