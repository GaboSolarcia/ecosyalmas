"use client";

import { useState } from "react";

export default function EliminarRango() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const inputClass =
    "w-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400";

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (!startDate || !endDate) { setError("Elige ambas fechas."); return; }
    if (!confirm(`¿Eliminar todos los horarios disponibles entre ${startDate} y ${endDate}?`)) return;

    setLoading(true);
    setError("");
    setResult(null);

    const res = await fetch("/api/disponibilidad", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setResult(`Se eliminaron ${data.deleted} horario${data.deleted !== 1 ? "s" : ""}.`);
      setStartDate("");
      setEndDate("");
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setError("Error al eliminar.");
    }
  }

  return (
    <form onSubmit={handleDelete} className="bg-red-50 dark:bg-stone-900 border border-red-200 dark:border-red-900 rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-red-800 dark:text-red-400">Eliminar horarios en masa</h2>
        <p className="text-sm text-red-600 dark:text-red-500 mt-0.5">
          Elimina todos los horarios disponibles dentro de un rango de fechas.
        </p>
      </div>
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {result && <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{result}</p>}
      <button
        type="submit"
        disabled={loading || !startDate || !endDate}
        className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Eliminando..." : "Eliminar horarios del rango"}
      </button>
    </form>
  );
}
