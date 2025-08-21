import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { categorySchema } from "@/lib/validators"
import z from "zod"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const category = await prisma?.category.findFirst({
      where: { id: params.id, userId: userId },
    })

    if (!category) return NextResponse.json({ error: "Categoria não encontrada" })

    return NextResponse.json(category)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao buscar categoria" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = categorySchema.parse(body)

    const updatedCategory = await prisma?.category.updateMany({
      where: { id: params.id, userId: userId },
      data: {
        name: parsed.name,
        color: parsed.color ?? null,
      },
    })

    if (updatedCategory?.count === 0)
      return NextResponse.json({ error: "Categoria não encontrada ou sem permissão" }, { status: 404 })

    return NextResponse.json({ message: "Categoria atualizada com sucesso" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const deletedCategory = await prisma?.category.deleteMany({
      where: { id: params.id, userId: userId },
    })

    if (deletedCategory?.count === 0)
      return NextResponse.json({ error: "Categoria não encontrada ou sem permissão" }, { status: 404 })

    return NextResponse.json({ message: "Categoria deletada com sucesso" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao deletar categoria" }, { status: 500 })
  }
}
