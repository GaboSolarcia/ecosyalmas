"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoSlotForm() {
  const router = useRouter();
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fecha || !horaInicio || !horaFin) {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/disponibilidad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha, horaInicio, horaFin }),
    });
    setLoading(false);
    if (res.ok) {
      setFecha("");
      setHoraInicio("");
      setHoraFin("");
      router.refresh();
    } else {
      setError("Error al guardar el horario.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4"
    >
      <h2 className="font-semibold text-stone-800">Agregar horario disponible</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-stone-600 mb-1">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm text-stone-600 mb-1">Hora inicio</label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm text-stone-600 mb-1">Hora fin</label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Agregar horario"}
      </button>
    </form>
  );
}
