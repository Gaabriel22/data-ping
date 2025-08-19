import { auth } from "@/lib/auth"
import { paymentSchema } from "@/lib/validators"
import { Payment } from "@/types/Payment"
import { NextResponse } from "next/server"
import z from "zod"

const idSchema = z.uuid()

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  try {
    const id = idSchema.parse(params.id)

    const payment = await prisma?.payment.findUnique({
      where: { id, userId },
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

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "ID Inválido" }, { status: 400 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const id = idSchema.parse(params.id)
    const body = await req.json()
    const data = paymentSchema.parse(body)

    const payment = await prisma?.payment.update({
      where: { id, userId },
      data,
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

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const id = idSchema.parse(params.id)

    await prisma?.payment.delete({
      where: { id, userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })
  }
}
