import { clerkClient } from "@clerk/nextjs/server"
import { auth } from "@/lib/auth"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId, sessionId, getToken } = await auth()

    if (!userId || !sessionId) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 })
    }

    const client = clerkClient()
    const user = (await client).users.getUser(userId)

    const token = await getToken({ template: "default" })
    let decodedToken: object | null = null

    if (token) {
      decodedToken = jwt.decode(token) as object
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (await user).id,
          name: (await user).firstName,
          email: (await user).emailAddresses[0]?.emailAddress,
          createdAt: (await user).createdAt,
        },
        sessionId,
        token: decodedToken,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro desconhecido",
      },
      { status: 500 }
    )
  }
}
