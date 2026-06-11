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
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Resumen de reservas</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "Total reservas", value: stats.total, color: "bg-stone-100" },
          { label: "Pendientes de confirmar", value: stats.pagadas, color: "bg-amber-50" },
          { label: "Confirmadas", value: stats.confirmadas, color: "bg-emerald-50" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} rounded-2xl p-6 border border-stone-200`}
          >
            <p className="text-3xl font-bold text-stone-900">{stat.value}</p>
            <p className="text-sm text-stone-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/reservas"
          className="bg-white border border-stone-200 rounded-2xl p-6 hover:border-emerald-300 transition-colors"
        >
          <h2 className="font-semibold text-stone-900 mb-1">Ver reservas</h2>
          <p className="text-sm text-stone-500">
            Revisa, confirma o cancela las reservas de tus clientes.
          </p>
        </Link>
        <Link
          href="/admin/disponibilidad"
          className="bg-white border border-stone-200 rounded-2xl p-6 hover:border-emerald-300 transition-colors"
        >
          <h2 className="font-semibold text-stone-900 mb-1">Gestionar disponibilidad</h2>
          <p className="text-sm text-stone-500">
            Agrega o elimina horarios disponibles para nuevas sesiones.
          </p>
        </Link>
      </div>
    </div>
  );
}
