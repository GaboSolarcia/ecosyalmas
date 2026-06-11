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

type Step = "fecha" | "hora" | "form" | "payment";

export default function BookingFlow() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("fecha");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/disponibilidad")
      .then((r) => r.json())
      .then((data) => { setSlots(data); setLoading(false); });
  }, []);

  function formatDate(fecha: string) {
    return new Date(fecha).toLocaleDateString("es-CR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  }

  // Group slots by date
  const slotsByDate = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const key = new Date(slot.fecha).toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  const availableDates = Object.keys(slotsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const slotsForDate = selectedDate ? (slotsByDate[selectedDate] ?? []) : [];
  const sessionPrice = (Number(process.env.NEXT_PUBLIC_SESSION_PRICE) || 5000) / 100;

  if (loading) return (
    <div className="text-center py-16 text-stone-400 dark:text-stone-500">Cargando disponibilidad...</div>
  );

  const inputClass =
    "w-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-stone-400 dark:placeholder:text-stone-600";

  const steps: Step[] = ["fecha", "hora", "form", "payment"];
  const stepLabels = ["Fecha", "Horario", "Tus datos", "Pago"];

  return (
    <div className="space-y-8">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-3 text-sm font-medium">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === s ? "bg-emerald-700 text-white"
              : i < steps.indexOf(step) ? "bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300"
              : "bg-stone-200 dark:bg-stone-800 text-stone-400"
            }`}>{i + 1}</div>
            <span className={step === s ? "text-stone-900 dark:text-stone-100" : "text-stone-400 dark:text-stone-500"}>
              {stepLabels[i]}
            </span>
            {i < steps.length - 1 && <span className="text-stone-300 dark:text-stone-600">›</span>}
          </div>
        ))}
      </div>

      {/* Step 1 — Pick a date */}
      {step === "fecha" && (
        <div className="space-y-3">
          <h2 className="font-semibold text-stone-800 dark:text-stone-200">¿Qué día te queda bien?</h2>
          {availableDates.length === 0 ? (
            <div className="text-center py-16 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-500 dark:text-stone-400">
              <p className="font-medium mb-1">No hay fechas disponibles</p>
              <p className="text-sm">Vuelve pronto o escríbenos para coordinar.</p>
            </div>
          ) : (
            availableDates.map((dateKey) => {
              const count = slotsByDate[dateKey].length;
              const sample = slotsByDate[dateKey][0];
              return (
                <button
                  key={dateKey}
                  onClick={() => { setSelectedDate(dateKey); setStep("hora"); }}
                  className="w-full text-left px-5 py-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <span className="font-medium text-stone-900 dark:text-stone-100 capitalize">
                    {formatDate(sample.fecha)}
                  </span>
                  <span className="ml-2 text-sm text-emerald-600 dark:text-emerald-400">
                    {count} horario{count > 1 ? "s" : ""} disponible{count > 1 ? "s" : ""}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Step 2 — Pick a time slot */}
      {step === "hora" && selectedDate && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-800 dark:text-stone-200">
              Elige tu horario — <span className="capitalize">{formatDate(slotsByDate[selectedDate][0].fecha)}</span>
            </h2>
            <button onClick={() => setStep("fecha")} className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
              ← Cambiar fecha
            </button>
          </div>
          {slotsForDate.map((slot) => (
            <button
              key={slot._id}
              onClick={() => { setSelectedSlot(slot); setStep("form"); }}
              className="w-full text-left px-5 py-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-stone-800 transition-colors"
            >
              <span className="font-medium text-stone-900 dark:text-stone-100">
                {slot.horaInicio} – {slot.horaFin}
              </span>
              <span className="ml-2 text-sm text-stone-500 dark:text-stone-400">2 horas</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 3 — Contact form */}
      {step === "form" && selectedSlot && (
        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl px-5 py-4 text-sm text-emerald-800 dark:text-emerald-300">
            <span className="font-medium capitalize">{formatDate(selectedSlot.fecha)}</span>
            <span> · {selectedSlot.horaInicio} – {selectedSlot.horaFin}</span>
          </div>
          <div className="space-y-4">
            {[
              { label: "Nombre completo", key: "nombre", type: "text", placeholder: "Tu nombre" },
              { label: "Correo electrónico", key: "email", type: "email", placeholder: "tu@correo.com" },
              { label: "Teléfono / WhatsApp", key: "telefono", type: "tel", placeholder: "+506 8888-0000" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">{label}</label>
                <input type={type} value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className={inputClass} placeholder={placeholder} />
              </div>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep("hora")}
              className="flex-1 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 py-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
              Atrás
            </button>
            <button
              onClick={() => {
                if (!form.nombre || !form.email || !form.telefono) { setError("Por favor completa todos los campos."); return; }
                setError(""); setStep("payment");
              }}
              className="flex-1 bg-emerald-700 text-white py-3 rounded-xl hover:bg-emerald-600 transition-colors font-medium">
              Continuar al pago
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Payment */}
      {step === "payment" && selectedSlot && (
        <div className="space-y-6">
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500 dark:text-stone-400">Sesión</span>
              <span className="font-medium text-stone-900 dark:text-stone-100">Constelaciones Familiares · 2h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 dark:text-stone-400">Fecha y hora</span>
              <span className="font-medium text-stone-900 dark:text-stone-100 capitalize">
                {formatDate(selectedSlot.fecha)} · {selectedSlot.horaInicio} – {selectedSlot.horaFin}
              </span>
            </div>
            <div className="flex justify-between border-t border-stone-200 dark:border-stone-700 pt-2 mt-2">
              <span className="font-semibold text-stone-900 dark:text-stone-100">Total</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">${sessionPrice.toFixed(2)} USD</span>
            </div>
          </div>
          <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: "USD" }}>
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
                return (await res.json()).orderID;
              }}
              onApprove={async (data) => {
                const res = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderID: data.orderID }),
                });
                if ((await res.json()).status === "COMPLETED") router.push("/reservar/confirmacion");
              }}
              onError={() => { setError("Error procesando el pago. Intenta de nuevo."); setStep("form"); }}
            />
          </PayPalScriptProvider>
          <button onClick={() => setStep("form")} className="w-full text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
            ← Volver
          </button>
        </div>
      )}
    </div>
  );
}
