"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur border-b border-stone-200 dark:border-stone-800">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
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

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-stone-600 dark:text-stone-400">
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

        {/* Mobile: theme + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50/98 dark:bg-stone-950/98 backdrop-blur px-6 py-4 flex flex-col gap-1">
          <Link
            href="/sobre-mi"
            onClick={() => setOpen(false)}
            className="text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 py-3 text-sm font-medium border-b border-stone-100 dark:border-stone-800 transition-colors"
          >
            Sobre mí
          </Link>
          <Link
            href="/reservar"
            onClick={() => setOpen(false)}
            className="text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 py-3 text-sm font-medium border-b border-stone-100 dark:border-stone-800 transition-colors"
          >
            Reservar
          </Link>
          <Link
            href="/reservar"
            onClick={() => setOpen(false)}
            className="mt-2 bg-emerald-700 text-white px-4 py-3 rounded-xl text-center text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            Agenda tu sesión
          </Link>
        </div>
      )}
    </header>
  );
}
