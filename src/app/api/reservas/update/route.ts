import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
  const { id, estado } = await req.json();
  const client = await clientPromise;
  const db = client.db("constelaciones");

  const reserva = await db.collection("reservas").findOne({ _id: new ObjectId(id) });
  if (!reserva) return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });

  await db.collection("reservas").updateOne(
    { _id: new ObjectId(id) },
    { $set: { estado } }
  );

  if (estado === "cancelado") {
    const ids = [reserva.disponibilidadId, reserva.disponibilidadId2].filter(Boolean);
    if (ids.length) {
      await db.collection("disponibilidades").updateMany(
        { _id: { $in: ids.map((i: ObjectId) => new ObjectId(i)) } },
        { $set: { disponible: true } }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
