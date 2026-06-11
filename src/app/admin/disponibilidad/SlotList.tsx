"use client";

import { useState } from "react";

interface Slot {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export default function SlotList({ slots }: { slots: Slot[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Group by date
  const byDate: Record<string, Slot[]> = {};
  for (const slot of slots) {
    const key = new Date(slot.fecha).toISOString().slice(0, 10);
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(slot);
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleDay(daySlots: Slot[]) {
    const ids = daySlots.filter((s) => s.disponible).map((s) => s.id);
    const allChecked = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => allChecked ? next.delete(id) : next.add(id));
      return next;
    });
  }

  function selectAll() {
    const all = slots.filter((s) => s.disponible).map((s) => s.id);
    setSelected(new Set(all));
  }

  function clearAll() {
    setSelected(new Set());
  }

  async function deleteSelected() {
    if (!confirm(`¿Eliminar ${selected.size} horario${selected.size !== 1 ? "s" : ""}?`)) return;
    setLoading(true);
    await fetch("/api/disponibilidad", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    window.location.reload();
  }

  const totalAvailable = slots.filter((s) => s.disponible).length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-stone-700 dark:text-stone-300">
          Próximos horarios
          <span className="ml-2 text-sm font-normal text-stone-400 dark:text-stone-500">
            {totalAvailable} disponible{totalAvailable !== 1 ? "s" : ""}
          </span>
        </h2>
        {totalAvailable > 0 && (
          <div className="flex gap-2 text-sm">
            <button onClick={selectAll}
              className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
              Seleccionar todo
            </button>
            {selected.size > 0 && (
              <button onClick={clearAll}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                · Limpiar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Slot list grouped by date */}
      {Object.keys(byDate).length === 0 ? (
        <div className="text-center py-12 bg-stone-100 dark:bg-stone-900 rounded-2xl text-stone-400 text-sm">
          No hay horarios cargados todavía.
        </div>
      ) : (
        Object.entries(byDate).map(([fecha, daySlots]) => {
          const label = new Date(fecha + "T12:00:00").toLocaleDateString("es-CR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          });
          const available = daySlots.filter((s) => s.disponible);
          const allDayChecked = available.length > 0 && available.every((s) => selected.has(s.id));
          const someDayChecked = available.some((s) => selected.has(s.id));

          return (
            <div key={fecha} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
              {/* Date header with "select day" checkbox */}
              <div className="flex items-center gap-3 px-5 py-3 bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
                {available.length > 0 && (
                  <input
                    type="checkbox"
                    checked={allDayChecked}
                    ref={(el) => { if (el) el.indeterminate = someDayChecked && !allDayChecked; }}
                    onChange={() => toggleDay(daySlots)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                )}
                <span className="font-medium text-stone-800 dark:text-stone-200 capitalize">{label}</span>
                <span className="text-xs text-stone-400 dark:text-stone-500 ml-auto">
                  {available.length} disponible{available.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Slots */}
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {daySlots.map((slot) => (
                  <div key={slot.id}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                      selected.has(slot.id) ? "bg-red-50 dark:bg-red-950/30" : ""
                    }`}
                  >
                    {slot.disponible ? (
                      <input
                        type="checkbox"
                        checked={selected.has(slot.id)}
                        onChange={() => toggle(slot.id)}
                        className="w-4 h-4 accent-emerald-600 cursor-pointer"
                      />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className="text-sm text-stone-700 dark:text-stone-300 flex-1">
                      {slot.horaInicio} – {slot.horaFin}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      slot.disponible
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                    }`}>
                      {slot.disponible ? "Disponible" : "Reservado"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Floating delete bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-stone-900 dark:bg-stone-950 text-white px-6 py-3 rounded-full shadow-2xl border border-stone-700">
          <span className="text-sm font-medium">
            {selected.size} seleccionado{selected.size !== 1 ? "s" : ""}
          </span>
          <button onClick={clearAll}
            className="text-stone-400 hover:text-white text-sm transition-colors">
            Cancelar
          </button>
          <button
            onClick={deleteSelected}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-50"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      )}
    </div>
  );
}
