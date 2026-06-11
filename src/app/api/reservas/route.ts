import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { Reserva } from "@/lib/models/types";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("constelaciones");
  const reservas = await db
    .collection<Reserva>("reservas")
    .find({})
    .sort({ creadoEn: -1 })
    .toArray();
  return NextResponse.json(reservas);
}
