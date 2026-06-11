import { NextRequest, NextResponse } from "next/server";

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
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  return (await res.json()).access_token as string;
}

export async function POST(req: NextRequest) {
  const { disponibilidadId, nombreCliente, emailCliente, telefonoCliente } = await req.json();
  const amount = ((Number(process.env.SESSION_PRICE) || 5000) / 100).toFixed(2);
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        amount: { currency_code: "USD", value: amount },
        description: "Sesión de Constelaciones Familiares (2h) — Ecos y Almas",
        custom_id: disponibilidadId,
      }],
      payer: { email_address: emailCliente },
      application_context: {
        brand_name: "Ecos y Almas",
        locale: "es-CR",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    }),
  });

  const order = await res.json();
  const { default: clientPromise } = await import("@/lib/mongodb");
  const client = await clientPromise;
  await client.db("constelaciones").collection("paypal_pending").insertOne({
    paypalOrderId: order.id,
    disponibilidadId,
    nombreCliente,
    emailCliente,
    telefonoCliente,
    creadoEn: new Date(),
  });

  return NextResponse.json({ orderID: order.id });
}
