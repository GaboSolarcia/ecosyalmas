import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre mí — Ecos y Almas",
  description: "Conoce a Taty Garnaj, constelladora certificada en Costa Rica.",
};

export default function SobreMiPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 px-6 bg-gradient-to-b from-emerald-50 to-stone-50">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-16 items-center">
          {/* Photo placeholder — replace src with real photo from Blob Storage */}
          <div className="w-full aspect-square max-w-sm mx-auto rounded-3xl bg-stone-200 flex items-center justify-center text-stone-400 text-sm">
            Foto de Taty
          </div>
          <div>
            <p className="text-emerald-700 font-medium tracking-widest text-sm uppercase mb-3">
              Tu constelladora
            </p>
            <h1 className="text-4xl font-bold text-stone-900 mb-6">
              Hola, soy Taty Garnaj
            </h1>
            <p className="text-stone-600 leading-relaxed mb-4">
              Soy constelladora certificada con formación en Constelaciones
              Familiares Sistémicas según el método de Bert Hellinger. Acompaño
              a personas y familias en procesos de sanación y reconciliación con
              su historia.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Mi camino con las constelaciones comenzó como una búsqueda
              personal y se convirtió en una vocación: acompañar a otros a
              descubrir el amor y el orden que ya existe en su sistema familiar.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Ofrezco sesiones individuales en modalidad presencial y virtual
              desde Costa Rica.
            </p>
          </div>
        </div>
      </section>

      {/* Formación */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-900 mb-12">
            Formación y enfoque
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Certificación",
                body: "Formada en Constelaciones Familiares Sistémicas con certificación avalada internacionalmente.",
              },
              {
                title: "Enfoque",
                body: "Trabajo con el método de Bert Hellinger integrando herramientas de consciencia sistémica y trauma.",
              },
              {
                title: "Modalidad",
                body: "Sesiones individuales presenciales en Costa Rica o virtuales para cualquier parte del mundo.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-stone-50 rounded-2xl p-6 border border-stone-100"
              >
                <h3 className="font-semibold text-stone-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-emerald-50 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">
          ¿Te resuena lo que lees?
        </h2>
        <p className="text-stone-600 mb-8 max-w-md mx-auto">
          Agenda una sesión y demos juntos el primer paso hacia la sanación.
        </p>
        <Link
          href="/reservar"
          className="bg-emerald-700 text-white px-8 py-4 rounded-full font-medium hover:bg-emerald-800 transition-colors"
        >
          Agenda tu sesión
        </Link>
      </section>
    </>
  );
}
