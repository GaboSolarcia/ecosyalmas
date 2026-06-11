import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur border-b border-stone-200 dark:border-stone-800">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-emerald-200 dark:ring-emerald-900 shrink-0">
            <Image
              src="/logo.jpeg"
              alt="Ecos y Almas"
              width={96}
              height={96}
              className="h-full w-full object-cover scale-125 dark:brightness-90"
              priority
            />
          </div>
          <span className="text-lg font-semibold tracking-tight text-emerald-800 dark:text-emerald-400">
            Ecos y Almas
          </span>
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
