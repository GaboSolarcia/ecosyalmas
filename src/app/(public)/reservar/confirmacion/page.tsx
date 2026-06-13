import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sesión confirmada — Ecos y Almas" };

export default function ConfirmacionPage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">🌿</div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-4">
          ¡Tu sesión está confirmada!
        </h1>
        <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
          Hemos recibido tu pago y pronto recibirás un correo con los detalles
          de tu sesión. Taty se pondrá en contacto contigo para confirmar todos
          los detalles.
        </p>
        <Link
          href="/"
          className="bg-emerald-700 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-800 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
