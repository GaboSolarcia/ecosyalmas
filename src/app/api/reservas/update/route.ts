import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
  const { id, estado } = await req.json();
  const client = await clientPromise;
  const db = client.db("constelaciones");
  await db
    .collection("reservas")
    .updateOne({ _id: new ObjectId(id) }, { $set: { estado } });
  return NextResponse.json({ ok: true });
}
