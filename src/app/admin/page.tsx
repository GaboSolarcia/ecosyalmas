import clientPromise from "@/lib/mongodb";
import Link from "next/link";

async function getStats() {
  const client = await clientPromise;
  const db = client.db("constelaciones");
  const [total, pagadas, confirmadas] = await Promise.all([
    db.collection("reservas").countDocuments(),
    db.collection("reservas").countDocuments({ estado: "pagado" }),
    db.collection("reservas").countDocuments({ estado: "confirmado" }),
  ]);
  return { total, pagadas, confirmadas };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Dashboard</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">Resumen de reservas</p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "Total reservas", value: stats.total, color: "bg-stone-100 dark:bg-stone-800" },
          { label: "Pendientes de confirmar", value: stats.pagadas, color: "bg-amber-50 dark:bg-amber-950" },
          { label: "Confirmadas", value: stats.confirmadas, color: "bg-emerald-50 dark:bg-emerald-950" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-6 border border-stone-200 dark:border-stone-700`}>
            <p className="text-3xl font-bold text-stone-900 dark:text-stone-50">{stat.value}</p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { href: "/admin/reservas", title: "Ver reservas", desc: "Revisa, confirma o cancela las reservas de tus clientes." },
          { href: "/admin/disponibilidad", title: "Gestionar disponibilidad", desc: "Agrega o elimina horarios disponibles para nuevas sesiones." },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
          >
            <h2 className="font-semibold text-stone-900 dark:text-stone-50 mb-1">{card.title}</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
