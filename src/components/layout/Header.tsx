"use client"

import { useTheme } from "next-themes"
import { UserButton } from "@clerk/nextjs"
import { Button } from "../ui/button"
import { Moon, Sun } from "lucide-react"

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-6 py-4 borber-b border-secondary bg-bg">
      <h1 className="text-xl font-semibold text-text">DataPing</h1>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-full"
        >
          {theme === "light" ? <Moon className="h-5 w-5 text-text" /> : <Sun className="h-5 w-5 text-text" />}
        </Button>

        <UserButton />
      </div>
    </header>
  )
}
