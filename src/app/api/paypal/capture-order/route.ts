import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { enviarConfirmacionCliente, notificarAdmin } from "@/lib/email";

const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  const { orderID } = await req.json();
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });

  const capture = await res.json();
  if (capture.status !== "COMPLETED") {
    return NextResponse.json({ error: "Pago no completado" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("constelaciones");

  const pending = await db.collection("paypal_pending").findOne({ paypalOrderId: orderID });
  if (!pending) return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });

  const { disponibilidadId, disponibilidadId2, duracion, nombreCliente, emailCliente, telefonoCliente } = pending;
  const basePrice = Number(process.env.SESSION_PRICE) || 5000;

  // Save booking
  await db.collection("reservas").insertOne({
    disponibilidadId: new ObjectId(disponibilidadId),
    disponibilidadId2: disponibilidadId2 ? new ObjectId(disponibilidadId2) : null,
    duracion,
    nombreCliente,
    emailCliente,
    telefonoCliente,
    paypalOrderId: orderID,
    estado: "pagado",
    monto: basePrice * (duracion ?? 1),
    creadoEn: new Date(),
  });

  // Mark slot(s) as unavailable
  const ids = [disponibilidadId, disponibilidadId2].filter(Boolean);
  await db.collection("disponibilidades").updateMany(
    { _id: { $in: ids.map((id: string) => new ObjectId(id)) } },
    { $set: { disponible: false } }
  );

  await db.collection("paypal_pending").deleteOne({ paypalOrderId: orderID });

  // Send emails
  const slot = await db.collection("disponibilidades").findOne({ _id: new ObjectId(disponibilidadId) });
  if (slot) {
    const fecha = new Date(slot.fecha).toLocaleDateString("es-CR", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    const horaFin = disponibilidadId2
      ? await db.collection("disponibilidades")
          .findOne({ _id: new ObjectId(disponibilidadId2) })
          .then((s) => s?.horaFin ?? slot.horaFin)
      : slot.horaFin;
    try {
      await Promise.all([
        enviarConfirmacionCliente(nombreCliente, emailCliente, fecha, `${slot.horaInicio} – ${horaFin}`),
        notificarAdmin(nombreCliente, emailCliente, fecha, `${slot.horaInicio} – ${horaFin}`),
      ]);
    } catch { /* email failure must not block confirmation */ }
  }

  return NextResponse.json({ status: "COMPLETED" });
}
