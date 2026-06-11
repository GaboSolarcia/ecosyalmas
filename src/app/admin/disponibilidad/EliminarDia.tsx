"use client";

import { useState } from "react";

export default function EliminarDia({ fecha }: { fecha: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`¿Eliminar todos los horarios disponibles del ${fecha}?`)) return;
    setLoading(true);
    await fetch("/api/disponibilidad", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha }),
    });
    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-500 border border-red-200 dark:border-red-900 px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Eliminar día"}
    </button>
  );
}
