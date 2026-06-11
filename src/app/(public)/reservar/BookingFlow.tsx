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

type Step = "duration" | "slot" | "form" | "payment";
type Duration = 1 | 2;

export default function BookingFlow() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("duration");
  const [duration, setDuration] = useState<Duration>(1);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [secondSlot, setSecondSlot] = useState<Slot | null>(null);
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

  // For 2h sessions: only show slots where the next consecutive slot is also available
  function getCompatibleSlots(): Slot[] {
    if (duration === 1) return slots;
    return slots.filter((slot, i) => {
      const next = slots[i + 1];
      if (!next) return false;
      const sameDay = new Date(slot.fecha).toDateString() === new Date(next.fecha).toDateString();
      return sameDay && slot.horaFin === next.horaInicio;
    });
  }

  function getSecondSlot(first: Slot): Slot | null {
    const idx = slots.findIndex((s) => s._id === first._id);
    return slots[idx + 1] ?? null;
  }

  const compatibleSlots = getCompatibleSlots();
  const sessionPrice = Number(process.env.NEXT_PUBLIC_SESSION_PRICE || 5000);
  const totalPrice = (sessionPrice * duration) / 100;

  if (loading) {
    return <div className="text-center py-16 text-stone-400 dark:text-stone-500">Cargando disponibilidad...</div>;
  }

  const inputClass =
    "w-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-stone-400 dark:placeholder:text-stone-600";

  const steps: Step[] = ["duration", "slot", "form", "payment"];
  const stepLabels = ["Duración", "Horario", "Tus datos", "Pago"];

  return (
    <div className="space-y-8">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-4 text-sm font-medium">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === s ? "bg-emerald-700 text-white"
              : i < steps.indexOf(step) ? "bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300"
              : "bg-stone-200 dark:bg-stone-800 text-stone-400"
            }`}>
              {i + 1}
            </div>
            <span className={step === s ? "text-stone-900 dark:text-stone-100" : "text-stone-400 dark:text-stone-500"}>
              {stepLabels[i]}
            </span>
            {i < steps.length - 1 && <span className="text-stone-300 dark:text-stone-600">›</span>}
          </div>
        ))}
      </div>

      {/* Step 1 — Pick duration */}
      {step === "duration" && (
        <div className="space-y-4">
          <h2 className="font-semibold text-stone-800 dark:text-stone-200">¿Cuánto tiempo necesitas?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {([1, 2] as Duration[]).map((d) => (
              <button
                key={d}
                onClick={() => { setDuration(d); setStep("slot"); }}
                className="text-left px-6 py-5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
              >
                <p className="font-semibold text-stone-900 dark:text-stone-100 text-lg">
                  {d === 1 ? "1 hora" : "2 horas"}
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                  ${(sessionPrice * d / 100).toFixed(2)} USD
                </p>
                <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
                  {d === 1 ? "Sesión individual estándar" : "Sesión extendida en profundidad"}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Pick slot */}
      {step === "slot" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-800 dark:text-stone-200">
              Elige un horario — {duration === 1 ? "1 hora" : "2 horas"}
            </h2>
            <button onClick={() => setStep("duration")} className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
              ← Cambiar duración
            </button>
          </div>
          {compatibleSlots.length === 0 ? (
            <div className="text-center py-16 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-500 dark:text-stone-400">
              <p className="font-medium mb-1">No hay horarios disponibles para {duration === 2 ? "2 horas" : "1 hora"}</p>
              {duration === 2 && <p className="text-sm">Prueba con 1 hora o consulta disponibilidad próximamente.</p>}
            </div>
          ) : (
            compatibleSlots.map((slot) => {
              const endSlot = duration === 2 ? getSecondSlot(slot) : null;
              const endTime = endSlot ? endSlot.horaFin : slot.horaFin;
              return (
                <button
                  key={slot._id}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setSecondSlot(duration === 2 ? getSecondSlot(slot) : null);
                    setStep("form");
                  }}
                  className="w-full text-left px-5 py-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors"
                >
                  <span className="capitalize font-medium">{formatDate(slot.fecha)}</span>
                  <span className="text-stone-500 dark:text-stone-400"> · {slot.horaInicio} – {endTime}</span>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Step 3 — Contact form */}
      {step === "form" && selectedSlot && (
        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl px-5 py-4 text-sm text-emerald-800 dark:text-emerald-300">
            <span className="font-medium">Sesión: </span>
            <span className="capitalize">{formatDate(selectedSlot.fecha)}</span>
            <span> · {selectedSlot.horaInicio} – {secondSlot ? secondSlot.horaFin : selectedSlot.horaFin}</span>
            <span className="ml-2 font-medium">({duration}h)</span>
          </div>
          <div className="space-y-4">
            {[
              { label: "Nombre completo", key: "nombre", type: "text", placeholder: "Tu nombre" },
              { label: "Correo electrónico", key: "email", type: "email", placeholder: "tu@correo.com" },
              { label: "Teléfono / WhatsApp", key: "telefono", type: "tel", placeholder: "+506 8888-0000" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className={inputClass}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep("slot")} className="flex-1 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 py-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
              Atrás
            </button>
            <button
              onClick={() => {
                if (!form.nombre || !form.email || !form.telefono) { setError("Por favor completa todos los campos."); return; }
                setError(""); setStep("payment");
              }}
              className="flex-1 bg-emerald-700 text-white py-3 rounded-xl hover:bg-emerald-600 transition-colors font-medium"
            >
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
              <span className="font-medium text-stone-900 dark:text-stone-100">Constelaciones Familiares</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 dark:text-stone-400">Duración</span>
              <span className="font-medium text-stone-900 dark:text-stone-100">{duration} hora{duration > 1 ? "s" : ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 dark:text-stone-400">Horario</span>
              <span className="font-medium text-stone-900 dark:text-stone-100 capitalize">
                {formatDate(selectedSlot.fecha)} · {selectedSlot.horaInicio} – {secondSlot ? secondSlot.horaFin : selectedSlot.horaFin}
              </span>
            </div>
            <div className="flex justify-between border-t border-stone-200 dark:border-stone-700 pt-2 mt-2">
              <span className="font-semibold text-stone-900 dark:text-stone-100">Total</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">${totalPrice.toFixed(2)} USD</span>
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
                    disponibilidadId2: secondSlot?._id ?? null,
                    duracion: duration,
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
                if (result.status === "COMPLETED") router.push("/reservar/confirmacion");
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
