import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { Disponibilidad } from "@/lib/models/types";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("constelaciones");
  const slots = await db
    .collection<Disponibilidad>("disponibilidades")
    .find({ disponible: true })
    .toArray();
  slots.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  return NextResponse.json(slots);
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

  // Single slot
  if (body.id) {
    await db.collection("disponibilidades").deleteOne({ _id: new ObjectId(body.id) });
    return NextResponse.json({ deleted: 1 });
  }

  // All slots for a specific date
  if (body.fecha) {
    const start = new Date(body.fecha + "T00:00:00.000Z");
    const end   = new Date(body.fecha + "T23:59:59.999Z");
    const r = await db.collection("disponibilidades").deleteMany({ fecha: { $gte: start, $lte: end } });
    return NextResponse.json({ deleted: r.deletedCount });
  }

  // Date range bulk delete
  if (body.startDate && body.endDate) {
    const start = new Date(body.startDate + "T00:00:00.000Z");
    const end   = new Date(body.endDate   + "T23:59:59.999Z");
    const r = await db.collection("disponibilidades").deleteMany({ fecha: { $gte: start, $lte: end } });
    return NextResponse.json({ deleted: r.deletedCount });
  }

  return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
}
