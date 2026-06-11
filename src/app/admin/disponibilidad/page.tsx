import clientPromise from "@/lib/mongodb";
import NuevoSlotForm from "./NuevoSlotForm";
import SlotList from "./SlotList";

async function getSlots() {
  const client = await clientPromise;
  const db = client.db("constelaciones");
  const slots = await db.collection("disponibilidades").find({}).toArray();
  return slots.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

export default async function DisponibilidadPage() {
  const raw = await getSlots();

  const slots = raw.map((s) => ({
    id: s._id.toString(),
    fecha: s.fecha.toISOString(),
    horaInicio: s.horaInicio,
    horaFin: s.horaFin,
    disponible: s.disponible,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Disponibilidad</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          Agrega horarios o selecciona los que quieres eliminar.
        </p>
      </div>

      <NuevoSlotForm />
      <SlotList slots={slots} />
    </div>
  );
}
