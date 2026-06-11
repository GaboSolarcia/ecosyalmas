import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur border-b border-stone-200 dark:border-stone-800">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-emerald-800 dark:text-emerald-400"
        >
          Ecos y Almas
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium text-stone-600 dark:text-stone-400">
          <Link href="/sobre-mi" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
            Sobre mí
          </Link>
          <Link href="/reservar" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
            Reservar
          </Link>
          <Link
            href="/reservar"
            className="bg-emerald-700 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors"
          >
            Agenda tu sesión
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
