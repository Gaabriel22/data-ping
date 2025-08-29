"use client"

import { CategoryForm } from "@/components/forms/CategoryForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Category } from "@/types/Category"
import { useEffect, useState } from "react"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const removeCategory = async (id: string) => {
    if (!confirm("Deseja realmente remover esta categoria?")) return
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" })
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <p>Carregando categorias...</p>

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CategoryForm mode="create" />
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Cor</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: c.color ?? "#ccc" }}
                    />
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => removeCategory(c.id)}
                      className="bg-red-500 text-white hover:opacity-90"
                    >
                      Remover
                    </Button>
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
