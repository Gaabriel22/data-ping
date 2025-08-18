import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validators"
import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = registerSchema.parse(body)

    const client = await clerkClient()
    const user = await client.users.createUser({
      emailAddress: [parsed.email],
      password: parsed.password,
      firstName: parsed.name,
    })

    await prisma.user.create({
      data: {
        id: user.id,
        name: parsed.name,
        email: parsed.email,
        timezone: parsed.timezone,
      },
    })

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (error) {
    console.error("❌ Erro no registro:", error)

    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Erro desconhecido" }, { status: 500 })
  }
}
