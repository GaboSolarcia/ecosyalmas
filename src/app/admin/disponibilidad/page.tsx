import clientPromise from "@/lib/mongodb";
import NuevoSlotForm from "./NuevoSlotForm";
import EliminarSlot from "./EliminarSlot";

async function getSlots() {
  const client = await clientPromise;
  const db = client.db("constelaciones");
  return db
    .collection("disponibilidades")
    .find({ fecha: { $gte: new Date() } })
    .sort({ fecha: 1 })
    .toArray();
}

export default async function DisponibilidadPage() {
  const slots = await getSlots();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Disponibilidad</h1>
        <p className="text-stone-500 text-sm mt-1">
          Agrega los horarios en los que puedes atender sesiones.
        </p>
      </div>

      <NuevoSlotForm />

      <div className="space-y-4">
        <h2 className="font-semibold text-stone-700">Próximos horarios</h2>
        {slots.length === 0 ? (
          <div className="text-center py-12 bg-stone-100 rounded-2xl text-stone-400 text-sm">
            No hay horarios cargados todavía.
          </div>
        ) : (
          slots.map((slot) => {
            const fecha = new Date(slot.fecha).toLocaleDateString("es-CR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            return (
              <div
                key={slot._id.toString()}
                className="bg-white border border-stone-200 rounded-xl px-5 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-stone-800 capitalize">{fecha}</p>
                  <p className="text-sm text-stone-500">
                    {slot.horaInicio} – {slot.horaFin} ·{" "}
                    <span
                      className={
                        slot.disponible
                          ? "text-emerald-600"
                          : "text-stone-400"
                      }
                    >
                      {slot.disponible ? "Disponible" : "Reservado"}
                    </span>
                  </p>
                </div>
                {slot.disponible && (
                  <EliminarSlot id={slot._id.toString()} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
