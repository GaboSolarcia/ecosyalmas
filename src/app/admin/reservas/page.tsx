import clientPromise from "@/lib/mongodb";
import ReservaActions from "./ReservaActions";

async function getReservas() {
  const client = await clientPromise;
  const db = client.db("constelaciones");
  const reservas = await db
    .collection("reservas")
    .aggregate([
      {
        $lookup: {
          from: "disponibilidades",
          localField: "disponibilidadId",
          foreignField: "_id",
          as: "slot",
        },
      },
      { $unwind: { path: "$slot", preserveNullAndEmptyArrays: true } },
    ])
    .toArray();
  return reservas.sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime());
}

const estadoColor: Record<string, string> = {
  pagado: "bg-amber-100 text-amber-800",
  confirmado: "bg-emerald-100 text-emerald-800",
  cancelado: "bg-red-100 text-red-700",
  pendiente: "bg-stone-100 text-stone-600",
};

export default async function ReservasPage() {
  const reservas = await getReservas();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Reservas</h1>
      {reservas.length === 0 ? (
        <div className="text-center py-16 bg-stone-100 rounded-2xl text-stone-500">
          No hay reservas todavía.
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((r) => {
            const fecha = r.slot?.fecha
              ? new Date(r.slot.fecha).toLocaleDateString("es-CR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—";
            return (
              <div
                key={r._id.toString()}
                className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-stone-900">{r.nombreCliente}</p>
                  <p className="text-sm text-stone-500">{r.emailCliente} · {r.telefonoCliente}</p>
                  <p className="text-sm text-stone-600 capitalize">
                    {fecha}{r.slot?.horaInicio ? ` · ${r.slot.horaInicio}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${estadoColor[r.estado] ?? "bg-stone-100"}`}
                  >
                    {r.estado}
                  </span>
                  <ReservaActions id={r._id.toString()} estado={r.estado} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
