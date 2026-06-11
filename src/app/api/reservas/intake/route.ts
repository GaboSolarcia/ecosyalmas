import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const {
    orderID,
    tema,
    paisResidencia,
    nacionalidad,
    profesion,
    edad,
    nombrePadre,
    nombreMadre,
    tieneHijos,
    numeroHijos,
    nombresHijos,
    lugarEntreHermanos,
    estadoCivil,
    nombrePareja,
    tiempoRelacion,
  } = await req.json();

  if (!orderID) return NextResponse.json({ error: "orderID requerido" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("constelaciones");

  await db.collection("reservas").updateOne(
    { paypalOrderId: orderID },
    {
      $set: {
        cuestionario: {
          tema,
          paisResidencia,
          nacionalidad,
          profesion,
          edad: edad ? Number(edad) : null,
          nombrePadre,
          nombreMadre,
          tieneHijos: tieneHijos === "si",
          numeroHijos: numeroHijos ? Number(numeroHijos) : null,
          nombresHijos,
          lugarEntreHermanos: lugarEntreHermanos ? Number(lugarEntreHermanos) : null,
          estadoCivil,
          nombrePareja,
          tiempoRelacion,
        },
        cuestionarioCompletadoEn: new Date(),
      },
    }
  );

  return NextResponse.json({ ok: true });
}
