"use client"

import { PaymentForm } from "@/components/forms/PaymentForm"

export default function NewPaymentPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-text">Novo Pagamento</h1>
      <PaymentForm mode="create" />
    </div>
  )
}
