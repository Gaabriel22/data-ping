"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Payment } from "@/types/Payment"
import { useEffect, useState } from "react"

export default function PaymentsPage() {
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

  const markAsPaid = async (id: string) => {
    await fetch(`/api/payments/${id}/mark-paid`, { method: "POST" })
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "paid" } : p))
    )
  }

  if (loading) return <p>Carregando...</p>

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vencimentos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Título</th>
                <th className="px-4 py-2">Valor</th>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{p.title}</td>
                  <td className="px-4 py-2">R$ {p.amount}</td>
                  <td className="px-4 py-2">
                    {new Date(p.dueDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-2">
                    {p.status === "paid" && (
                      <span className="text-green-500 font-semibold">Pago</span>
                    )}
                    {p.status === "unpaid" && (
                      <span className="text-yellow-500 font-semibold">
                        Pendente
                      </span>
                    )}
                    {p.status === "overdue" && (
                      <span className="text-red-500 font-semibold">
                        Atrasado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {p.status !== "paid" && (
                      <Button size="sm" onClick={() => markAsPaid(p.id)}>
                        Marcar como pago
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
