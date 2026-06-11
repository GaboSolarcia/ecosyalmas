"use client";

import { useState } from "react";

export default function NuevoSlotForm() {
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState<string[]>([]);

  const inputClass =
    "w-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400";

  // Preview slots that will be generated
  function preview() {
    if (!horaInicio || !horaFin) return [];
    const slots: string[] = [];
    let [h, m] = horaInicio.split(":").map(Number);
    const [endH, endM] = horaFin.split(":").map(Number);
    const endMinutes = endH * 60 + endM;
    while (h * 60 + m + 60 <= endMinutes) {
      const nextH = h + Math.floor((m + 60) / 60);
      const nextM = (m + 60) % 60;
      slots.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} – ${String(nextH).padStart(2, "0")}:${String(nextM).padStart(2, "0")}`
      );
      h = nextH;
      m = nextM;
    }
    return slots;
  }

  const previewSlots = preview();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fecha || !horaInicio || !horaFin) { setError("Completa todos los campos."); return; }
    if (previewSlots.length === 0) { setError("El rango no genera ningún horario de 1 hora."); return; }
    setLoading(true);
    setError("");

    // Create all 1-hour slots in parallel
    const results = await Promise.all(
      previewSlots.map((slot) => {
        const [inicio, fin] = slot.split(" – ");
        return fetch("/api/disponibilidad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fecha, horaInicio: inicio, horaFin: fin }),
        });
      })
    );

    const allOk = results.every((r) => r.ok);
    setLoading(false);

    if (allOk) {
      setGenerated(previewSlots);
      window.location.reload();
    } else {
      setError("Error al guardar alguno de los horarios.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-stone-800 dark:text-stone-200">Agregar horarios disponibles</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          Elige una fecha y tu ventana de trabajo. Se generarán bloques de 1 hora automáticamente.
        </p>
      </div>
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

      {/* Preview of slots that will be created */}
      {previewSlots.length > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-2">
            Se crearán {previewSlots.length} bloque{previewSlots.length > 1 ? "s" : ""} de 1 hora:
          </p>
          <div className="flex flex-wrap gap-2">
            {previewSlots.map((s) => (
              <span key={s} className="text-xs bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading || previewSlots.length === 0}
        className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Generando..." : `Generar ${previewSlots.length > 0 ? previewSlots.length : ""} horario${previewSlots.length !== 1 ? "s" : ""}`}
      </button>
    </form>
  );
}
