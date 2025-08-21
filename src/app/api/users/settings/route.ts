import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const userSettingsSchema = z.object({
  name: z.string().min(2, "Nome muito curto").optional(),
  timezone: z.string().optional(),
})

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = userSettingsSchema.parse(body)

    const updatedUser = await prisma?.user.update({
      where: { id: userId },
      data: {
        name: parsed.name ?? undefined,
        timezone: parsed.timezone ?? undefined,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 })
  }
}
