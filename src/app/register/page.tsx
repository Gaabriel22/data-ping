"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerSchema } from "@/lib/validators"
import { useRouter } from "next/router"
import { useState } from "react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      registerSchema.parse({ name, email, password, timezone })

      setLoading(true)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, timezone }),
      })

      const data = await res.json()
      if (!res.ok || !data.sucess) {
        setError(data.error || "Erro ao registrar")
        return
      }

      router.push("/dashboard")
    } catch (error: any) {
      if (error.errors) {
        setError(error.errors[0].message)
      } else {
        setError("Erro inesperado")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="w-full max-w-md rounded-2xl bg-secondary p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-text">
          Criar Conta - DataPing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text">Nome</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 bg-bg text-text focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 bg-bg text-text focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 bg-bg text-text focus:border-primary focus:ring-primary"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow hover:bg-accent disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </form>
      </div>
    </div>
  )
}
