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

type Step = "slot" | "form" | "payment" | "intake";

const DIAL_CODES = [
  // ——— América ———
  { code: "+506", flag: "🇨🇷", name: "Costa Rica" },
  { code: "+54",  flag: "🇦🇷", name: "Argentina" },
  { code: "+1",   flag: "🇧🇸", name: "Bahamas" },
  { code: "+1",   flag: "🇧🇧", name: "Barbados" },
  { code: "+501", flag: "🇧🇿", name: "Belice" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia" },
  { code: "+55",  flag: "🇧🇷", name: "Brasil" },
  { code: "+1",   flag: "🇨🇦", name: "Canadá" },
  { code: "+56",  flag: "🇨🇱", name: "Chile" },
  { code: "+57",  flag: "🇨🇴", name: "Colombia" },
  { code: "+53",  flag: "🇨🇺", name: "Cuba" },
  { code: "+1",   flag: "🇩🇲", name: "Dominica" },
  { code: "+593", flag: "🇪🇨", name: "Ecuador" },
  { code: "+503", flag: "🇸🇻", name: "El Salvador" },
  { code: "+1",   flag: "🇺🇸", name: "Estados Unidos" },
  { code: "+1",   flag: "🇬🇩", name: "Granada" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala" },
  { code: "+592", flag: "🇬🇾", name: "Guyana" },
  { code: "+509", flag: "🇭🇹", name: "Haití" },
  { code: "+504", flag: "🇭🇳", name: "Honduras" },
  { code: "+1",   flag: "🇯🇲", name: "Jamaica" },
  { code: "+52",  flag: "🇲🇽", name: "México" },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua" },
  { code: "+507", flag: "🇵🇦", name: "Panamá" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "+51",  flag: "🇵🇪", name: "Perú" },
  { code: "+1",   flag: "🇰🇳", name: "San Cristóbal y Nieves" },
  { code: "+1",   flag: "🇱🇨", name: "Santa Lucía" },
  { code: "+1",   flag: "🇻🇨", name: "San Vicente y Granadinas" },
  { code: "+597", flag: "🇸🇷", name: "Surinam" },
  { code: "+1",   flag: "🇹🇹", name: "Trinidad y Tobago" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "+58",  flag: "🇻🇪", name: "Venezuela" },
  { code: "+1",   flag: "🇩🇴", name: "República Dominicana" },
  { code: "+1",   flag: "🇦🇬", name: "Antigua y Barbuda" },
  // ——— Europa ———
  { code: "+355", flag: "🇦🇱", name: "Albania" },
  { code: "+376", flag: "🇦🇩", name: "Andorra" },
  { code: "+43",  flag: "🇦🇹", name: "Austria" },
  { code: "+375", flag: "🇧🇾", name: "Bielorrusia" },
  { code: "+32",  flag: "🇧🇪", name: "Bélgica" },
  { code: "+387", flag: "🇧🇦", name: "Bosnia y Herzegovina" },
  { code: "+359", flag: "🇧🇬", name: "Bulgaria" },
  { code: "+357", flag: "🇨🇾", name: "Chipre" },
  { code: "+385", flag: "🇭🇷", name: "Croacia" },
  { code: "+45",  flag: "🇩🇰", name: "Dinamarca" },
  { code: "+421", flag: "🇸🇰", name: "Eslovaquia" },
  { code: "+386", flag: "🇸🇮", name: "Eslovenia" },
  { code: "+34",  flag: "🇪🇸", name: "España" },
  { code: "+372", flag: "🇪🇪", name: "Estonia" },
  { code: "+358", flag: "🇫🇮", name: "Finlandia" },
  { code: "+33",  flag: "🇫🇷", name: "Francia" },
  { code: "+995", flag: "🇬🇪", name: "Georgia" },
  { code: "+30",  flag: "🇬🇷", name: "Grecia" },
  { code: "+36",  flag: "🇭🇺", name: "Hungría" },
  { code: "+353", flag: "🇮🇪", name: "Irlanda" },
  { code: "+354", flag: "🇮🇸", name: "Islandia" },
  { code: "+39",  flag: "🇮🇹", name: "Italia" },
  { code: "+371", flag: "🇱🇻", name: "Letonia" },
  { code: "+423", flag: "🇱🇮", name: "Liechtenstein" },
  { code: "+370", flag: "🇱🇹", name: "Lituania" },
  { code: "+352", flag: "🇱🇺", name: "Luxemburgo" },
  { code: "+389", flag: "🇲🇰", name: "Macedonia del Norte" },
  { code: "+356", flag: "🇲🇹", name: "Malta" },
  { code: "+373", flag: "🇲🇩", name: "Moldavia" },
  { code: "+377", flag: "🇲🇨", name: "Mónaco" },
  { code: "+382", flag: "🇲🇪", name: "Montenegro" },
  { code: "+47",  flag: "🇳🇴", name: "Noruega" },
  { code: "+31",  flag: "🇳🇱", name: "Países Bajos" },
  { code: "+48",  flag: "🇵🇱", name: "Polonia" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+44",  flag: "🇬🇧", name: "Reino Unido" },
  { code: "+40",  flag: "🇷🇴", name: "Rumanía" },
  { code: "+7",   flag: "🇷🇺", name: "Rusia" },
  { code: "+378", flag: "🇸🇲", name: "San Marino" },
  { code: "+381", flag: "🇷🇸", name: "Serbia" },
  { code: "+46",  flag: "🇸🇪", name: "Suecia" },
  { code: "+41",  flag: "🇨🇭", name: "Suiza" },
  { code: "+90",  flag: "🇹🇷", name: "Turquía" },
  { code: "+380", flag: "🇺🇦", name: "Ucrania" },
  // ——— Oceanía ———
  { code: "+61",  flag: "🇦🇺", name: "Australia" },
  { code: "+679", flag: "🇫🇯", name: "Fiyi" },
  { code: "+64",  flag: "🇳🇿", name: "Nueva Zelanda" },
  { code: "+675", flag: "🇵🇬", name: "Papúa Nueva Guinea" },
];

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

function CalendarPicker({
  availableDates,
  selectedDate,
  onSelectDate,
}: {
  availableDates: Set<string>;
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function toKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors">
          ‹
        </button>
        <span className="font-semibold text-stone-900 dark:text-stone-100">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors">
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-stone-400 dark:text-stone-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const key = toKey(viewYear, viewMonth, day);
          const isAvailable = availableDates.has(key);
          const isSelected = selectedDate === key;
          const isPast = new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button
              key={i}
              disabled={!isAvailable || isPast}
              onClick={() => onSelectDate(key)}
              className={`
                mx-auto w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors font-medium
                ${isSelected
                  ? "bg-emerald-700 text-white"
                  : isAvailable && !isPast
                  ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-700 hover:text-white"
                  : "text-stone-300 dark:text-stone-600 cursor-default"
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-stone-400 dark:text-stone-500 mt-4 text-center">
        Los días en <span className="text-emerald-600 dark:text-emerald-400 font-medium">verde</span> tienen horarios disponibles
      </p>
    </div>
  );
}

export default function BookingFlow() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("slot");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "" });
  const [dialCode, setDialCode] = useState("+506");
  const [error, setError] = useState("");
  const [capturedOrderId, setCapturedOrderId] = useState("");
  const [intake, setIntake] = useState({
    tema: "",
    paisResidencia: "",
    nacionalidad: "",
    profesion: "",
    edad: "",
    nombrePadre: "",
    nombreMadre: "",
    tieneHijos: "" as "" | "si" | "no",
    numeroHijos: "",
    nombresHijos: "",
    lugarEntreHermanos: "",
    estadoCivil: "",
    nombrePareja: "",
    tiempoRelacion: "",
  });
  const [intakeLoading, setIntakeLoading] = useState(false);

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

  const slotsByDate = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const key = slot.fecha.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  const availableDates = new Set(Object.keys(slotsByDate));
  const slotsForDate = selectedDate ? (slotsByDate[selectedDate] ?? []) : [];
  const sessionPrice = (Number(process.env.NEXT_PUBLIC_SESSION_PRICE) || 5000) / 100;

  if (loading) return (
    <div className="text-center py-16 text-stone-400 dark:text-stone-500">Cargando disponibilidad...</div>
  );

  const inputClass =
    "w-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-stone-400 dark:placeholder:text-stone-600";

  const steps: Step[] = ["slot", "form", "payment", "intake"];
  const stepLabels = ["Fecha y hora", "Tus datos", "Pago", "Cuestionario"];

  return (
    <div className="space-y-8">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-1 sm:gap-3 text-sm font-medium">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1 sm:gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              step === s ? "bg-emerald-700 text-white"
              : i < steps.indexOf(step) ? "bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300"
              : "bg-stone-200 dark:bg-stone-800 text-stone-400"
            }`}>{i + 1}</div>
            <span className={`hidden sm:inline ${step === s ? "text-stone-900 dark:text-stone-100" : "text-stone-400 dark:text-stone-500"}`}>
              {stepLabels[i]}
            </span>
            {i < steps.length - 1 && <span className="text-stone-300 dark:text-stone-600 text-xs">›</span>}
          </div>
        ))}
      </div>

      {/* Step 1 — Calendar + time slots */}
      {step === "slot" && (
        <div className="space-y-5">
          {availableDates.size === 0 ? (
            <div className="text-center py-16 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-500 dark:text-stone-400">
              <p className="font-medium mb-1">No hay fechas disponibles</p>
              <p className="text-sm">Vuelve pronto o escríbenos para coordinar.</p>
            </div>
          ) : (
            <>
              <CalendarPicker
                availableDates={availableDates}
                selectedDate={selectedDate}
                onSelectDate={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
              />

              {/* Time slots — appear once a date is selected */}
              {selectedDate && (
                <div className="space-y-3">
                  <h2 className="font-semibold text-stone-800 dark:text-stone-200">
                    Horarios disponibles —{" "}
                    <span className="capitalize font-normal text-stone-500 dark:text-stone-400">
                      {formatDate(selectedDate + "T12:00:00")}
                    </span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {slotsForDate.map((slot) => {
                      const isSelected = selectedSlot?._id === slot._id;
                      return (
                        <button
                          key={slot._id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-2 rounded-xl border text-sm font-medium transition-colors ${
                            isSelected
                              ? "bg-emerald-700 text-white border-emerald-700"
                              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-500 dark:hover:border-emerald-500"
                          }`}
                        >
                          {slot.horaInicio} – {slot.horaFin}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Continue — only when slot is picked */}
              {selectedSlot && (
                <div className="pt-1">
                  <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl px-5 py-3 text-sm text-emerald-800 dark:text-emerald-300 mb-3">
                    <span className="font-medium capitalize">{formatDate(selectedDate + "T12:00:00")}</span>
                    <span> · {selectedSlot.horaInicio} – {selectedSlot.horaFin}</span>
                  </div>
                  <button
                    onClick={() => setStep("form")}
                    className="w-full bg-emerald-700 text-white py-4 rounded-xl font-medium hover:bg-emerald-600 transition-colors text-lg"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Step 2 — Contact form */}
      {step === "form" && selectedSlot && (
        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl px-5 py-4 text-sm text-emerald-800 dark:text-emerald-300">
            <span className="font-medium capitalize">{formatDate(selectedDate + "T12:00:00")}</span>
            <span> · {selectedSlot.horaInicio} – {selectedSlot.horaFin}</span>
          </div>
          <div className="space-y-4">
            {[
              { label: "Nombre completo", key: "nombre", type: "text", placeholder: "Tu nombre" },
              { label: "Correo electrónico", key: "email", type: "email", placeholder: "tu@correo.com" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">{label}</label>
                <input type={type} value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className={inputClass} placeholder={placeholder} />
              </div>
            ))}

            {/* Phone with country code */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Teléfono / WhatsApp
              </label>
              <div className="flex rounded-xl border border-stone-300 dark:border-stone-700 focus-within:ring-2 focus-within:ring-emerald-400 overflow-hidden">
                <select
                  value={dialCode}
                  onChange={(e) => setDialCode(e.target.value)}
                  className="bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm px-3 py-3 border-r border-stone-300 dark:border-stone-700 focus:outline-none cursor-pointer"
                >
                  {DIAL_CODES.map((c) => (
                    <option key={c.name} value={c.code}>
                      {c.flag} {c.code} {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="88880000"
                  className="flex-1 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 px-4 py-3 text-sm focus:outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600"
                />
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep("slot")}
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

      {/* Step 3 — Payment */}
      {step === "payment" && selectedSlot && (
        <div className="space-y-6">
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500 dark:text-stone-400">Sesión</span>
              <span className="font-medium text-stone-900 dark:text-stone-100">Constelaciones Familiares · 2h</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-stone-500 dark:text-stone-400 shrink-0">Fecha y hora</span>
              <span className="font-medium text-stone-900 dark:text-stone-100 capitalize sm:text-right">
                {formatDate(selectedDate + "T12:00:00")} · {selectedSlot.horaInicio} – {selectedSlot.horaFin}
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
                    telefonoCliente: `${dialCode} ${form.telefono}`,
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
                if ((await res.json()).status === "COMPLETED") {
                  setCapturedOrderId(data.orderID);
                  setStep("intake");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              onError={() => { setError("Error procesando el pago. Intenta de nuevo."); setStep("form"); }}
            />
          </PayPalScriptProvider>
          <button onClick={() => setStep("form")} className="w-full text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
            ← Volver
          </button>
        </div>
      )}

      {/* Step 4 — Intake questionnaire */}
      {step === "intake" && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!intake.tema || !intake.edad || !intake.estadoCivil || !intake.tieneHijos) {
              setError("Por favor completa los campos obligatorios (*).");
              return;
            }
            setIntakeLoading(true);
            setError("");
            await fetch("/api/reservas/intake", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: capturedOrderId, ...intake }),
            });
            setIntakeLoading(false);
            router.push("/reservar/confirmacion");
          }}
          className="space-y-8"
        >
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl px-5 py-4 text-sm text-emerald-800 dark:text-emerald-300">
            <p className="font-semibold mb-1">¡Pago recibido! Un paso más</p>
            <p>Para preparar tu sesión, la consteladora necesita conocerte un poco antes. Completa este cuestionario con calma y honestidad.</p>
          </div>

          {/* Sección 1: La sesión */}
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-stone-700 pb-2">
              Sobre tu sesión
            </h3>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                ¿Qué tema o situación deseas constelar? <span className="text-red-400">*</span>
              </label>
              <textarea
                value={intake.tema}
                onChange={(e) => setIntake({ ...intake, tema: e.target.value })}
                rows={4}
                placeholder="Describe con tus propias palabras lo que deseas explorar, sanar o comprender en esta sesión..."
                className={inputClass + " resize-none"}
              />
            </div>
          </div>

          {/* Sección 2: Datos personales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-stone-700 pb-2">
              Datos personales
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Edad <span className="text-red-400">*</span>
                </label>
                <input
                  type="number" min="1" max="120"
                  value={intake.edad}
                  onChange={(e) => setIntake({ ...intake, edad: e.target.value })}
                  placeholder="Ej. 34"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Profesión</label>
                <input
                  type="text"
                  value={intake.profesion}
                  onChange={(e) => setIntake({ ...intake, profesion: e.target.value })}
                  placeholder="Ej. Docente, Ingeniero/a..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">País donde vives</label>
                <input
                  type="text"
                  value={intake.paisResidencia}
                  onChange={(e) => setIntake({ ...intake, paisResidencia: e.target.value })}
                  placeholder="Ej. Costa Rica"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nacionalidad</label>
                <input
                  type="text"
                  value={intake.nacionalidad}
                  onChange={(e) => setIntake({ ...intake, nacionalidad: e.target.value })}
                  placeholder="Ej. Costarricense"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Sección 3: Familia de origen */}
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-stone-700 pb-2">
              Familia de origen
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nombre del padre</label>
                <input
                  type="text"
                  value={intake.nombrePadre}
                  onChange={(e) => setIntake({ ...intake, nombrePadre: e.target.value })}
                  placeholder="Nombre completo"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nombre de la madre</label>
                <input
                  type="text"
                  value={intake.nombreMadre}
                  onChange={(e) => setIntake({ ...intake, nombreMadre: e.target.value })}
                  placeholder="Nombre completo"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                ¿Qué lugar ocupas entre tus hermanos?
              </label>
              <input
                type="number" min="1"
                value={intake.lugarEntreHermanos}
                onChange={(e) => setIntake({ ...intake, lugarEntreHermanos: e.target.value })}
                placeholder="Ej. 1 si eres el/la mayor, 2 si eres el/la segundo/a..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Sección 4: Familia actual */}
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-stone-700 pb-2">
              Familia actual
            </h3>

            {/* Estado civil */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Estado civil <span className="text-red-400">*</span>
              </label>
              <select
                value={intake.estadoCivil}
                onChange={(e) => setIntake({ ...intake, estadoCivil: e.target.value, nombrePareja: "", tiempoRelacion: "" })}
                className={inputClass}
              >
                <option value="">Selecciona una opción</option>
                <option value="soltero">Soltero/a</option>
                <option value="casado">Casado/a</option>
                <option value="union_libre">Unión libre</option>
                <option value="divorciado">Divorciado/a</option>
                <option value="separado">Separado/a</option>
                <option value="viudo">Viudo/a</option>
              </select>
            </div>

            {/* Pareja — solo si no es soltero */}
            {intake.estadoCivil && intake.estadoCivil !== "soltero" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nombre de tu pareja</label>
                  <input
                    type="text"
                    value={intake.nombrePareja}
                    onChange={(e) => setIntake({ ...intake, nombrePareja: e.target.value })}
                    placeholder="Nombre completo"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Tiempo de relación</label>
                  <input
                    type="text"
                    value={intake.tiempoRelacion}
                    onChange={(e) => setIntake({ ...intake, tiempoRelacion: e.target.value })}
                    placeholder="Ej. 3 años, 8 meses..."
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* Hijos */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                ¿Tienes hijos? <span className="text-xs font-normal text-stone-400">(incluye no nacidos)</span>{" "}
                <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3">
                {(["si", "no"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setIntake({ ...intake, tieneHijos: v, numeroHijos: "", nombresHijos: "" })}
                    className={`px-6 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      intake.tieneHijos === v
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-emerald-400"
                    }`}
                  >
                    {v === "si" ? "Sí" : "No"}
                  </button>
                ))}
              </div>
            </div>

            {intake.tieneHijos === "si" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    ¿Cuántos hijos tienes? <span className="text-xs font-normal text-stone-400">(incluye no nacidos)</span>
                  </label>
                  <input
                    type="number" min="1"
                    value={intake.numeroHijos}
                    onChange={(e) => setIntake({ ...intake, numeroHijos: e.target.value })}
                    placeholder="Ej. 2"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Nombres de tus hijos <span className="text-xs font-normal text-stone-400">(incluye no nacidos)</span>
                  </label>
                  <textarea
                    value={intake.nombresHijos}
                    onChange={(e) => setIntake({ ...intake, nombresHijos: e.target.value })}
                    rows={3}
                    placeholder="Escribe el nombre de cada hijo/a, uno por línea..."
                    className={inputClass + " resize-none"}
                  />
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={intakeLoading}
            className="w-full bg-emerald-700 text-white py-4 rounded-xl font-medium hover:bg-emerald-600 transition-colors text-lg disabled:opacity-50"
          >
            {intakeLoading ? "Enviando..." : "Enviar y confirmar sesión"}
          </button>
          <p className="text-xs text-center text-stone-400 dark:text-stone-500">
            Esta información es confidencial y solo será vista por la consteladora.
          </p>
        </form>
      )}
    </div>
  );
}
