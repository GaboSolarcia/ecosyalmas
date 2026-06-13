import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { jwtVerify } from "jose";
import clientPromise from "@/lib/mongodb";
import { enviarConfirmacionCliente } from "@/lib/email";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
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

    if (estado === "confirmado") {
      try {
        const slot = await db.collection("disponibilidades").findOne({
          _id: new ObjectId(reserva.disponibilidadId),
        });
        if (slot) {
          const fecha = new Date(slot.fecha).toLocaleDateString("es-CR", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          });
          const slotFin = reserva.disponibilidadId2
            ? await db.collection("disponibilidades")
                .findOne({ _id: new ObjectId(reserva.disponibilidadId2) })
                .then((s) => s?.horaFin ?? slot.horaFin)
            : slot.horaFin;
          await enviarConfirmacionCliente(
            reserva.nombreCliente,
            reserva.emailCliente,
            fecha,
            `${slot.horaInicio} – ${slotFin}`
          );
        }
      } catch {
        // email failure must not block the status update
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
