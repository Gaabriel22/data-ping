"use client"

import { PaymentForm } from "@/components/forms/PaymentForm"
import { Payment } from "@/types/Payment"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditPaymentPage() {
  const { id } = useParams() as { id: string }
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchPayment = async () => {
      try {
        const res = await fetch(`/api/payments/${id}`)
        if (res.ok) {
          const data = await res.json()
          setPayment(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchPayment()
  }, [id])

  if (loading) return <p>Carregando...</p>
  if (!payment) return <p>Pagamento não encontrado.</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-text">Editar Pagamento</h1>
      <PaymentForm mode="edit" paymentId={id} defaultValues={payment} />
    </div>
  )
}
