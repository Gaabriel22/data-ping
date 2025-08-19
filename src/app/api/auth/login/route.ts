import { loginSchema } from "@/lib/validators"
import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = loginSchema.parse(body)

    const client = await clerkClient()
    const users = await client.users.getUserList({
      emailAddress: [parsed.email],
      limit: 1,
    })

    const user = users.data[0]
    if (!user) {
      return NextResponse.json({ success: false, error: "Usuário não encontrado" }, { status: 400 })
    }

    const session = await client.sessions.createSession({
      userId: user.id,
    })

    return NextResponse.json(
      {
        success: true,
        userId: user.id,
        sessionId: session.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Erro no login:", error)

    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Erro desconhecido" }, { status: 500 })
  }
}
