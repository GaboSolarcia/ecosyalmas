import { Db, ObjectId } from "mongodb";

// Costa Rica is UTC-6 (no DST)
const CR_OFFSET_MS = 6 * 60 * 60 * 1000;

function slotStartUtc(fecha: Date, horaInicio: string): Date {
  const [h, m] = horaInicio.split(":").map(Number);
  return new Date(fecha.getTime() + (h * 60 + m) * 60_000 + CR_OFFSET_MS);
}

export async function deleteExpiredSlots(db: Db): Promise<number> {
  const cutoff = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const available = await db
    .collection("disponibilidades")
    .find({ disponible: true })
    .toArray();

  const expiredIds = available
    .filter((s) => slotStartUtc(new Date(s.fecha), s.horaInicio) < cutoff)
    .map((s) => new ObjectId(s._id.toString()));

  if (expiredIds.length > 0) {
    await db.collection("disponibilidades").deleteMany({
      _id: { $in: expiredIds },
    });
  }

  return expiredIds.length;
}
