import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background image */}
        <Image
          src="/constelaciones.jpg"
          alt="Constelaciones Familiares"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/65" />

        {/* Gradient fade to next section */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white dark:from-stone-900 to-transparent" />

        {/* Content on top */}
        <div className="relative z-10">
        <p className="text-emerald-300 font-medium tracking-widest text-sm uppercase mb-4">
          Constelaciones Familiares
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight max-w-3xl">
          Sana los patrones que se repiten en tu familia
        </h1>
        <p className="mt-6 text-xl text-stone-200 max-w-xl leading-relaxed mx-auto">
          Un espacio de encuentro donde lo que se ha callado por generaciones
          puede finalmente ser visto, nombrado y sanado.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/reservar"
            className="bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Agenda tu sesión
          </Link>
          <Link
            href="/sobre-mi"
            className="border border-white/40 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-colors"
          >
            Conoce a Taty
          </Link>
        </div>
        </div>
      </section>

      {/* ¿Qué son las Constelaciones? */}
      <section className="py-24 px-6 bg-white dark:bg-stone-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 text-center mb-4">
            ¿Qué son las Constelaciones Familiares?
          </h2>
          <p className="text-center text-stone-500 dark:text-stone-400 mb-16 max-w-xl mx-auto">
            Un método terapéutico creado por Bert Hellinger que trabaja con los
            vínculos invisibles que nos unen a nuestra familia.
          </p>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                icon: "🌱",
                title: "Revelan el origen",
                body: "Permiten ver cómo los eventos del pasado familiar —duelos, traumas, secretos— siguen influyendo en tu vida hoy.",
              },
              {
                icon: "🔗",
                title: "Sanan los vínculos",
                body: "A través de representaciones simbólicas, se restaura el orden y el amor dentro del sistema familiar.",
              },
              {
                icon: "✨",
                title: "Liberan el presente",
                body: "Al reconocer lo que te pertenece y lo que no, puedes vivir con mayor libertad, amor y autenticidad.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Para quién es? */}
      <section className="py-24 px-6 bg-emerald-50 dark:bg-stone-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 text-center mb-12">
            ¿Para quién es una sesión?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              "Sientes que repites patrones en tus relaciones o situaciones de vida",
              "Has vivido duelos, pérdidas o separaciones difíciles de procesar",
              "Sientes que cargas con algo que no es tuyo pero no sabes qué es",
              "Quieres sanar tu relación con tus padres, hijos o pareja",
              "Buscas claridad ante decisiones importantes de tu vida",
              "Deseas reconectar con tu fuerza interior y tu sentido de pertenencia",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800"
              >
                <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
                <p className="text-stone-700 dark:text-stone-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6 bg-stone-900 dark:bg-black text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          ¿Listo para dar el primer paso?
        </h2>
        <p className="text-stone-400 mb-10 max-w-md mx-auto">
          Agenda tu sesión individual de Constelaciones Familiares y comienza tu
          proceso de sanación.
        </p>
        <Link
          href="/reservar"
          className="bg-emerald-500 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-emerald-400 transition-colors"
        >
          Agenda ahora
        </Link>
      </section>
    </>
  );
}
