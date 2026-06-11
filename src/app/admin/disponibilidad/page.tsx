import clientPromise from "@/lib/mongodb";
import NuevoSlotForm from "./NuevoSlotForm";
import EliminarSlot from "./EliminarSlot";
import EliminarDia from "./EliminarDia";
import EliminarRango from "./EliminarRango";

async function getSlots() {
  const client = await clientPromise;
  const db = client.db("constelaciones");
  const slots = await db.collection("disponibilidades").find({}).toArray();
  return slots.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

export default async function DisponibilidadPage() {
  const slots = await getSlots();

  // Group by date
  const byDate: Record<string, typeof slots> = {};
  for (const slot of slots) {
    const key = new Date(slot.fecha).toISOString().slice(0, 10);
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(slot);
  }

  const totalAvailable = slots.filter((s) => s.disponible).length;
  const totalBooked = slots.filter((s) => !s.disponible).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Disponibilidad</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {totalAvailable} disponible{totalAvailable !== 1 ? "s" : ""} · {totalBooked} reservado{totalBooked !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <NuevoSlotForm />
      <EliminarRango />

      {/* Slot list grouped by date */}
      <div className="space-y-4">
        <h2 className="font-semibold text-stone-700 dark:text-stone-300">Próximos horarios</h2>
        {Object.keys(byDate).length === 0 ? (
          <div className="text-center py-12 bg-stone-100 dark:bg-stone-900 rounded-2xl text-stone-400 text-sm">
            No hay horarios cargados todavía.
          </div>
        ) : (
          Object.entries(byDate).map(([fecha, daySlots]) => {
            const label = new Date(fecha + "T12:00:00").toLocaleDateString("es-CR", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            });
            const available = daySlots.filter((s) => s.disponible).length;
            return (
              <div key={fecha} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
                {/* Date header */}
                <div className="flex items-center justify-between px-5 py-3 bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
                  <div>
                    <span className="font-medium text-stone-800 dark:text-stone-200 capitalize">{label}</span>
                    <span className="ml-2 text-xs text-stone-400 dark:text-stone-500">
                      {available} disponible{available !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {available > 0 && <EliminarDia fecha={fecha} />}
                </div>

                {/* Slots for this day */}
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {daySlots.map((slot) => (
                    <div key={slot._id.toString()} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-stone-700 dark:text-stone-300">
                        {slot.horaInicio} – {slot.horaFin}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          slot.disponible
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                        }`}>
                          {slot.disponible ? "Disponible" : "Reservado"}
                        </span>
                        {slot.disponible && <EliminarSlot id={slot._id.toString()} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
