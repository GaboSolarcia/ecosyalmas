"use client";

import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

interface Slot {
  _id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

type Step = "slot" | "form" | "payment";

export default function BookingFlow() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("slot");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/disponibilidad")
      .then((r) => r.json())
      .then((data) => {
        setSlots(data);
        setLoading(false);
      });
  }, []);

  function formatSlot(slot: Slot) {
    const fecha = new Date(slot.fecha).toLocaleDateString("es-CR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${fecha} · ${slot.horaInicio} – ${slot.horaFin}`;
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-stone-400">
        Cargando disponibilidad...
      </div>
    );
  }

  if (slots.length === 0 && step === "slot") {
    return (
      <div className="text-center py-16 bg-stone-100 rounded-2xl text-stone-500">
        <p className="text-lg font-medium mb-2">No hay horarios disponibles</p>
        <p className="text-sm">Vuelve pronto o escríbenos para coordinar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-4 text-sm font-medium">
        {(["slot", "form", "payment"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s
                  ? "bg-emerald-700 text-white"
                  : i < ["slot", "form", "payment"].indexOf(step)
                  ? "bg-emerald-200 text-emerald-800"
                  : "bg-stone-200 text-stone-400"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={
                step === s ? "text-stone-900" : "text-stone-400"
              }
            >
              {s === "slot" ? "Horario" : s === "form" ? "Tus datos" : "Pago"}
            </span>
            {i < 2 && <span className="text-stone-300">›</span>}
          </div>
        ))}
      </div>

      {/* Step 1 — Pick a slot */}
      {step === "slot" && (
        <div className="space-y-3">
          <h2 className="font-semibold text-stone-800">
            Elige un horario disponible
          </h2>
          {slots.map((slot) => (
            <button
              key={slot._id}
              onClick={() => {
                setSelectedSlot(slot);
                setStep("form");
              }}
              className="w-full text-left px-5 py-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
            >
              <span className="capitalize">{formatSlot(slot)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 2 — Contact form */}
      {step === "form" && selectedSlot && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 text-sm text-emerald-800">
            <span className="font-medium">Sesión seleccionada: </span>
            <span className="capitalize">{formatSlot(selectedSlot)}</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="+506 8888-0000"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={() => setStep("slot")}
              className="flex-1 border border-stone-300 text-stone-600 py-3 rounded-xl hover:bg-stone-50 transition-colors"
            >
              Atrás
            </button>
            <button
              onClick={() => {
                if (!form.nombre || !form.email || !form.telefono) {
                  setError("Por favor completa todos los campos.");
                  return;
                }
                setError("");
                setStep("payment");
              }}
              className="flex-1 bg-emerald-700 text-white py-3 rounded-xl hover:bg-emerald-800 transition-colors font-medium"
            >
              Continuar al pago
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Payment */}
      {step === "payment" && selectedSlot && (
        <div className="space-y-6">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Sesión</span>
              <span className="font-medium">Constelaciones Familiares</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Horario</span>
              <span className="font-medium capitalize">{formatSlot(selectedSlot)}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 mt-2">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-emerald-700">
                ${((Number(process.env.NEXT_PUBLIC_SESSION_PRICE || 5000)) / 100).toFixed(2)} USD
              </span>
            </div>
          </div>
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
              currency: "USD",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical", shape: "pill", label: "pay" }}
              createOrder={async () => {
                const res = await fetch("/api/paypal/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    disponibilidadId: selectedSlot._id,
                    nombreCliente: form.nombre,
                    emailCliente: form.email,
                    telefonoCliente: form.telefono,
                  }),
                });
                const data = await res.json();
                return data.orderID;
              }}
              onApprove={async (data) => {
                const res = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderID: data.orderID }),
                });
                const result = await res.json();
                if (result.status === "COMPLETED") {
                  router.push("/reservar/confirmacion");
                }
              }}
              onError={() => {
                setError("Hubo un error procesando el pago. Intenta de nuevo.");
                setStep("form");
              }}
            />
          </PayPalScriptProvider>
          <button
            onClick={() => setStep("form")}
            className="w-full text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            ← Volver
          </button>
        </div>
      )}
    </div>
  );
}
