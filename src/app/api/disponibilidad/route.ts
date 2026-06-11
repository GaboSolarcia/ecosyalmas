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
  const { id } = await req.json();
  const { ObjectId } = await import("mongodb");
  const client = await clientPromise;
  const db = client.db("constelaciones");
  await db
    .collection("disponibilidades")
    .deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
