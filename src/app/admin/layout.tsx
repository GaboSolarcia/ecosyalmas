import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <header className="bg-stone-900 dark:bg-black text-white border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-6 py-3 sm:h-14 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <span className="font-semibold text-emerald-400">Ecos y Almas · Admin</span>
          <nav className="flex items-center gap-4 sm:gap-6 text-sm text-stone-400 flex-wrap">
            <Link href="/admin" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/admin/reservas" className="hover:text-white transition-colors">Reservas</Link>
            <Link href="/admin/disponibilidad" className="hover:text-white transition-colors">Disponibilidad</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>
    </div>
  );
}
