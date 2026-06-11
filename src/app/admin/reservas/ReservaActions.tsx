"use client";

import { useState } from "react";

export default function ReservaActions({
  id,
  estado,
}: {
  id: string;
  estado: string;
}) {
  const [loading, setLoading] = useState(false);

  async function updateEstado(nuevoEstado: string) {
    setLoading(true);
    await fetch("/api/reservas/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado: nuevoEstado }),
    });
    window.location.reload();
  }

  if (estado === "cancelado") return null;

  return (
    <div className="flex gap-2">
      {estado === "pagado" && (
        <button
          onClick={() => updateEstado("confirmado")}
          disabled={loading}
          className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          Confirmar
        </button>
      )}
      <button
        onClick={() => updateEstado("cancelado")}
        disabled={loading}
        className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        Cancelar
      </button>
    </div>
  );
}
