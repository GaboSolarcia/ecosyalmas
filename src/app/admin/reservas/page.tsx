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
  pagado: "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300",
  confirmado: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300",
  cancelado: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
  pendiente: "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400",
};

const estadoCivilLabel: Record<string, string> = {
  soltero: "Soltero/a", casado: "Casado/a", union_libre: "Unión libre",
  divorciado: "Divorciado/a", separado: "Separado/a", viudo: "Viudo/a",
};

export default async function ReservasPage() {
  const reservas = await getReservas();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Reservas</h1>
      {reservas.length === 0 ? (
        <div className="text-center py-16 bg-stone-100 dark:bg-stone-900 rounded-2xl text-stone-500 dark:text-stone-400">
          No hay reservas todavía.
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((r) => {
            const fecha = r.slot?.fecha
              ? new Date(r.slot.fecha).toLocaleDateString("es-CR", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })
              : "—";
            const q = r.cuestionario;

            return (
              <div
                key={r._id.toString()}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
                  <div className="space-y-1">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{r.nombreCliente}</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{r.emailCliente} · {r.telefonoCliente}</p>
                    <p className="text-sm text-stone-600 dark:text-stone-300 capitalize">
                      {fecha}{r.slot?.horaInicio ? ` · ${r.slot.horaInicio}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${estadoColor[r.estado] ?? "bg-stone-100 dark:bg-stone-800"}`}>
                      {r.estado}
                    </span>
                    {!q && (
                      <span className="text-xs px-2 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500">
                        Sin cuestionario
                      </span>
                    )}
                    <ReservaActions id={r._id.toString()} estado={r.estado} />
                  </div>
                </div>

                {/* Cuestionario */}
                {q && (
                  <div className="border-t border-stone-100 dark:border-stone-800 px-5 py-4 bg-stone-50 dark:bg-stone-800/50 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">Cuestionario</p>

                    {/* Tema */}
                    <div>
                      <p className="text-xs text-stone-400 dark:text-stone-500 mb-0.5">Tema a constelar</p>
                      <p className="text-sm text-stone-800 dark:text-stone-200 whitespace-pre-line">{q.tema}</p>
                    </div>

                    {/* Datos personales */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {q.edad && <Field label="Edad" value={`${q.edad} años`} />}
                      {q.profesion && <Field label="Profesión" value={q.profesion} />}
                      {q.paisResidencia && <Field label="País" value={q.paisResidencia} />}
                      {q.nacionalidad && <Field label="Nacionalidad" value={q.nacionalidad} />}
                    </div>

                    {/* Familia de origen */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {q.nombrePadre && <Field label="Padre" value={q.nombrePadre} />}
                      {q.nombreMadre && <Field label="Madre" value={q.nombreMadre} />}
                      {q.lugarEntreHermanos && (
                        <Field label="Lugar entre hermanos" value={`${q.lugarEntreHermanos}°`} />
                      )}
                    </div>

                    {/* Familia actual */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {q.estadoCivil && <Field label="Estado civil" value={estadoCivilLabel[q.estadoCivil] ?? q.estadoCivil} />}
                      {q.nombrePareja && <Field label="Pareja" value={q.nombrePareja} />}
                      {q.tiempoRelacion && <Field label="Tiempo de relación" value={q.tiempoRelacion} />}
                      <Field
                        label="Hijos"
                        value={q.tieneHijos ? `Sí${q.numeroHijos ? ` (${q.numeroHijos})` : ""}` : "No"}
                      />
                    </div>

                    {q.nombresHijos && (
                      <div>
                        <p className="text-xs text-stone-400 dark:text-stone-500 mb-0.5">Nombres de hijos</p>
                        <p className="text-sm text-stone-800 dark:text-stone-200 whitespace-pre-line">{q.nombresHijos}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-stone-400 dark:text-stone-500">{label}</p>
      <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{value}</p>
    </div>
  );
}
