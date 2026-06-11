"use client";

import { useState } from "react";

type Tab = "semanal" | "dia";

function getWeekdayDates(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start + "T12:00:00");
  const last = new Date(end + "T12:00:00");
  while (cur <= last) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(cur.toISOString().slice(0, 10));
    }
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

const WEEKDAY_SLOTS = [
  { horaInicio: "10:00", horaFin: "12:00" },
  { horaInicio: "12:00", horaFin: "14:00" },
  { horaInicio: "14:00", horaFin: "16:00" },
  { horaInicio: "16:00", horaFin: "18:00" },
];

function generateDaySlots(horaInicio: string, horaFin: string) {
  const slots: { horaInicio: string; horaFin: string }[] = [];
  let [h, m] = horaInicio.split(":").map(Number);
  const [endH, endM] = horaFin.split(":").map(Number);
  const endMinutes = endH * 60 + endM;
  while (h * 60 + m + 120 <= endMinutes) {
    const nH = h + Math.floor((m + 120) / 60);
    const nM = (m + 120) % 60;
    slots.push({
      horaInicio: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      horaFin: `${String(nH).padStart(2, "0")}:${String(nM).padStart(2, "0")}`,
    });
    h = nH; m = nM;
  }
  return slots;
}

async function createSlots(slots: { fecha: string; horaInicio: string; horaFin: string }[]) {
  return Promise.all(
    slots.map((s) =>
      fetch("/api/disponibilidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      })
    )
  );
}

export default function NuevoSlotForm() {
  const [tab, setTab] = useState<Tab>("semanal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Weekday tab
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Single day tab
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("10:00");
  const [horaFin, setHoraFin] = useState("18:00");

  const inputClass =
    "w-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400";

  const weekdayDates = startDate && endDate ? getWeekdayDates(startDate, endDate) : [];
  const weekdaySlotCount = weekdayDates.length * WEEKDAY_SLOTS.length;

  const daySlots = fecha && horaInicio && horaFin ? generateDaySlots(horaInicio, horaFin) : [];

  async function handleWeekdays(e: React.FormEvent) {
    e.preventDefault();
    if (!startDate || !endDate || weekdayDates.length === 0) { setError("Elige un rango válido."); return; }
    setLoading(true); setError("");
    const all = weekdayDates.flatMap((d) => WEEKDAY_SLOTS.map((s) => ({ fecha: d, ...s })));
    const results = await createSlots(all);
    setLoading(false);
    if (results.every((r) => r.ok)) window.location.reload();
    else setError("Error al guardar algunos horarios.");
  }

  async function handleDay(e: React.FormEvent) {
    e.preventDefault();
    if (!fecha || daySlots.length === 0) { setError("Completa todos los campos."); return; }
    setLoading(true); setError("");
    const all = daySlots.map((s) => ({ fecha, ...s }));
    const results = await createSlots(all);
    setLoading(false);
    if (results.every((r) => r.ok)) window.location.reload();
    else setError("Error al guardar los horarios.");
  }

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-stone-800 dark:text-stone-200">Agregar disponibilidad</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Sesiones de 2 horas generadas automáticamente.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["semanal", "dia"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(""); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t
                ? "bg-emerald-700 text-white"
                : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
            }`}
          >
            {t === "semanal" ? "Entre semana (lun–vie)" : "Día específico"}
          </button>
        ))}
      </div>

      {/* Weekday tab */}
      {tab === "semanal" && (
        <form onSubmit={handleWeekdays} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1">Desde</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1">Hasta</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
            </div>
          </div>
          {weekdayDates.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4 text-sm">
              <p className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">
                {weekdayDates.length} días hábiles → {weekdaySlotCount} bloques de 2h:
              </p>
              <p className="text-emerald-700 dark:text-emerald-400">
                10:00–12:00 · 12:00–14:00 · 14:00–16:00 · 16:00–18:00 por cada día
              </p>
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading || weekdayDates.length === 0}
            className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50">
            {loading ? "Generando..." : `Generar ${weekdaySlotCount > 0 ? weekdaySlotCount : ""} horarios`}
          </button>
        </form>
      )}

      {/* Single day tab */}
      {tab === "dia" && (
        <form onSubmit={handleDay} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1">Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1">Desde</label>
              <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1">Hasta</label>
              <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} className={inputClass} />
            </div>
          </div>
          {daySlots.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-2">
                Se crearán {daySlots.length} bloque{daySlots.length > 1 ? "s" : ""} de 2h:
              </p>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((s) => (
                  <span key={s.horaInicio} className="text-xs bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg">
                    {s.horaInicio} – {s.horaFin}
                  </span>
                ))}
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading || daySlots.length === 0}
            className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50">
            {loading ? "Generando..." : "Generar horarios"}
          </button>
        </form>
      )}
    </div>
  );
}
