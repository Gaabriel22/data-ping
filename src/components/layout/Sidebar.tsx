import { currentUser } from "@/lib/auth"
import { Bell, CreditCard, Folder, LayoutDashboard, Settings, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function Sidebar() {
  const user = await currentUser()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/payments", label: "Pagamentos", icon: CreditCard },
    { href: "/categories", label: "Categorias", icon: Folder },
    { href: "/reminders", label: "Lembretes", icon: Bell },
    { href: "/settings", label: "Configurações", icon: Settings },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-secondary bg-bg text-text">
      <Image src="/logo-dataPing.png" width={64} height={64} alt="Logo DataPing" />
      <div className="h-16 flex items-center px-6 text-xl font-bold border-b border-secondary">DataPing</div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Usuário */}
      {user && (
        <div className="p-4 border-t border-secondary flex items-center gap-3">
          <User className="w-8 h-8 rounded-full border border-secondary p-1" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.firstName}</span>
            <span className="text-xs text-secondary">{user.emailAddresses[0]?.emailAddress}</span>
          </div>
        </div>
      )}
    </aside>
  )
}
