import { NextRequest, NextResponse } from "next/server";
import { Db, ObjectId as ObjId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { Disponibilidad } from "@/lib/models/types";

// Costa Rica is UTC-6 (no DST)
const CR_OFFSET_MS = 6 * 60 * 60 * 1000;

function slotStartUtc(fecha: Date, horaInicio: string): Date {
  const [h, m] = horaInicio.split(":").map(Number);
  // fecha is midnight UTC for the given date; horaInicio is CR local time
  return new Date(fecha.getTime() + (h * 60 + m) * 60_000 + CR_OFFSET_MS);
}

async function deleteExpiredSlots(db: Db) {
  const cutoff = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const available = await db
    .collection<Disponibilidad>("disponibilidades")
    .find({ disponible: true })
    .toArray();

  const expiredIds = available
    .filter((s) => slotStartUtc(new Date(s.fecha), s.horaInicio) < cutoff)
    .map((s) => new ObjId(s._id.toString()));

  if (expiredIds.length > 0) {
    await db.collection("disponibilidades").deleteMany({
      _id: { $in: expiredIds },
    });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("constelaciones");

    await deleteExpiredSlots(db);

    const slots = await db
      .collection<Disponibilidad>("disponibilidades")
      .find({ disponible: true })
      .toArray();
    slots.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    return NextResponse.json(slots);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { fecha, horaInicio, horaFin } = await req.json();
  if (!fecha || !horaInicio || !horaFin) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db("constelaciones");
  const result = await db.collection<Disponibilidad>("disponibilidades").insertOne({
    fecha: new Date(fecha),
    horaInicio,
    horaFin,
    disponible: true,
    creadoEn: new Date(),
  });
  return NextResponse.json({ id: result.insertedId }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("constelaciones");

  if (body.ids?.length) {
    const r = await db.collection("disponibilidades").deleteMany({
      _id: { $in: body.ids.map((id: string) => new ObjId(id)) },
    });
    return NextResponse.json({ deleted: r.deletedCount });
  }

  if (body.id) {
    await db.collection("disponibilidades").deleteOne({ _id: new ObjId(body.id) });
    return NextResponse.json({ deleted: 1 });
  }

  return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
}
