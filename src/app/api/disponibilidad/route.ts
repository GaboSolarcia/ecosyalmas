import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";
import type { Disponibilidad } from "@/lib/models/types";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("constelaciones");
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
  const { ObjectId } = await import("mongodb");
  const client = await clientPromise;
  const db = client.db("constelaciones");

  // Bulk delete by array of IDs
  if (body.ids?.length) {
    const r = await db.collection("disponibilidades").deleteMany({
      _id: { $in: body.ids.map((id: string) => new ObjectId(id)) },
    });
    return NextResponse.json({ deleted: r.deletedCount });
  }

  // Single slot
  if (body.id) {
    await db.collection("disponibilidades").deleteOne({ _id: new ObjectId(body.id) });
    return NextResponse.json({ deleted: 1 });
  }

  return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
}
