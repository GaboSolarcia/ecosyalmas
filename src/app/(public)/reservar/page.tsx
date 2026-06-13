import type { Metadata } from "next";
import BookingFlow from "./BookingFlow";

export const metadata: Metadata = {
  title: "Reservar sesión — Ecos y Almas",
  description: "Agenda tu sesión de Constelaciones Familiares con Taty Garnaj.",
};

export default function ReservarPage() {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2 text-center">
          Agenda tu sesión
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-center mb-12">
          Elige un horario disponible, completa tus datos y realiza el pago para
          confirmar tu reserva.
        </p>
        <BookingFlow />
      </div>
    </section>
  );
}
