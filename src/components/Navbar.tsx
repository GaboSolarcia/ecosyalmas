import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-stone-50/90 backdrop-blur border-b border-stone-200">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-emerald-800"
        >
          Ecos y Almas
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link href="/sobre-mi" className="hover:text-emerald-700 transition-colors">
            Sobre mí
          </Link>
          <Link href="/reservar" className="hover:text-emerald-700 transition-colors">
            Reservar
          </Link>
          <Link
            href="/reservar"
            className="bg-emerald-700 text-white px-4 py-2 rounded-full hover:bg-emerald-800 transition-colors"
          >
            Agenda tu sesión
          </Link>
        </div>
      </nav>
    </header>
  );
}
