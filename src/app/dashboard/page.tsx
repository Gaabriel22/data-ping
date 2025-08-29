"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

type Payment = {
  id: string
  title: string
  amount: string
  status: "paid" | "unpaid" | "overdue"
  dueDate: string
}

const COLORS = ["#22c55e", "#eab308", "#ef4444"] // verde, amarelo, vermelho

export default function DashboardPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await fetch("/api/payments")
      if (res.ok) {
        const data = await res.json()
        setPayments(data)
      }
      setLoading(false)
    }
    fetchPayments()
  }, [])

  if (loading) return <p>Carregando...</p>

  const total = payments.length
  const paid = payments.filter((p) => p.status === "paid").length
  const unpaid = payments.filter((p) => p.status === "unpaid").length
  const overdue = payments.filter((p) => p.status === "overdue").length

  const upcoming = [...payments]
    .filter((p) => p.status !== "paid")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5)

  const markAsPaid = async (id: string) => {
    await fetch(`/api/payments/${id}/mark-paid`, { method: "POST" })
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "paid" } : p))
    )
  }

  const chartData = [
    { name: "Pagos", value: paid },
    { name: "Pendentes", value: unpaid },
    { name: "Atrasados", value: overdue },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{paid}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500">{unpaid}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atrasados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{overdue}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Próximos vencimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos vencimentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcoming.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(p.dueDate).toLocaleDateString("pt-BR")} - R${" "}
                  {p.amount}
                </p>
              </div>
              {p.status !== "paid" ? (
                <Button size="sm" onClick={() => markAsPaid(p.id)}>
                  Marcar como Pago
                </Button>
              ) : (
                <span className="text-green-500 text-sm">Pago</span>
              )}
            </div>
          ))}
          <div className="pt-2">
            <Link href="/payments">
              <Button variant="outline" className="w-full">
                Ver todos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
