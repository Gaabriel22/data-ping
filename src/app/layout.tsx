import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Data Ping",
  description: "Gerenciador de Vencimentos Pessoais",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="pt-BR" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--color-bg)] text-[var(--color-text)]`}
        >
          <div className="grid min-h-screen grid-cols-[240px_1fr]">
            {/* Sidebar fixa */}
            <Sidebar />

            {/* Área principal */}
            <div className="flex flex-col">
              <Header />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
