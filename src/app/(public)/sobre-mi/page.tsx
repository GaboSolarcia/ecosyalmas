import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre mí — Ecos y Almas",
  description: "Conoce a Taty Garnaj, constelladora certificada en Costa Rica.",
};

export default function SobreMiPage() {
  return (
    <>
      <section className="py-24 px-6 bg-gradient-to-b from-emerald-50 to-stone-50 dark:from-stone-900 dark:to-stone-950">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-16 items-center">
          <div className="w-full aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/taty.jpeg"
              alt="Taty Garcia — Consteladora"
              width={500}
              height={500}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-emerald-700 dark:text-emerald-400 font-medium tracking-widest text-sm uppercase mb-3">
              Tu consteladora
            </p>
            <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-50 mb-6">
              Hola, soy Taty Garcia
            </h1>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Soy constelladora certificada con formación en Constelaciones
              Familiares (Argentina) Facilitador sistematico en Psicodinamicas Sistematicas basado en
              Constelaciones Familiares (Venezuela) Registros Akashico 1 y 2 (Argentina)
              Formacion Integral Desarrollo Humano y tecnicas de Sanacion (Costa Rica)
              Consejeria Matrimonial 1 y 2 (Costa Rica).
              Tel: (506) 8998-0174
              Correo de contacto: tatyanagn@hotmail.com

            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Mi camino con las constelaciones comenzó como una búsqueda
              personal y se convirtió en una vocación: acompañar a otros a
              descubrir el amor y el orden que ya existe en su sistema familiar.
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Ofrezco sesiones individuales y grupales en modalidad presencial y virtual
              desde Costa Rica.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white dark:bg-stone-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-12">
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
                className="bg-stone-50 dark:bg-stone-800 rounded-2xl p-6 border border-stone-100 dark:border-stone-700"
              >
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-emerald-50 dark:bg-stone-950 text-center">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4">
          ¿Te resuena lo que lees?
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-8 max-w-md mx-auto">
          Agenda una sesión y demos juntos el primer paso hacia la sanación.
        </p>
        <Link
          href="/reservar"
          className="bg-emerald-700 text-white px-8 py-4 rounded-full font-medium hover:bg-emerald-600 transition-colors"
        >
          Agenda tu sesión
        </Link>
      </section>
    </>
  );
}
