import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { Reserva } from "@/lib/models/types";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("constelaciones");
  const reservas = await db.collection<Reserva>("reservas").find({}).toArray();
  reservas.sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime());
  return NextResponse.json(reservas);
}
