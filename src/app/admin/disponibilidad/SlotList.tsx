"use client";

import { useState } from "react";

interface Slot {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7; // Mon=0 … Sun=6
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function SlotList({ slots }: { slots: Slot[] }) {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Index slots by date
  const slotsByDate: Record<string, Slot[]> = {};
  for (const slot of slots) {
    const key = new Date(slot.fecha).toISOString().slice(0, 10);
    if (!slotsByDate[key]) slotsByDate[key] = [];
    slotsByDate[key].push(slot);
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
    setSelectedDate(null);
    setSelected(new Set());
  }

  function nextMonth() {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
    setSelectedDate(null);
    setSelected(new Set());
  }

  function selectDate(dateStr: string) {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
    setSelected(new Set());
  }

  const daySlots = selectedDate ? (slotsByDate[selectedDate] ?? []) : [];
  const availableInDay = daySlots.filter((s) => s.disponible);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function toggleDay() {
    const ids = availableInDay.map((s) => s.id);
    const allChecked = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (allChecked ? next.delete(id) : next.add(id)));
      return next;
    });
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
  const monthLabel = new Date(calYear, calMonth, 1).toLocaleDateString("es-CR", {
    month: "long", year: "numeric",
  });

  // Build calendar grid (Mon-first)
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-stone-700 dark:text-stone-300">
        Próximos horarios
        <span className="ml-2 text-sm font-normal text-stone-400 dark:text-stone-500">
          {totalAvailable} disponible{totalAvailable !== 1 ? "s" : ""}
        </span>
      </h2>

      {slots.length === 0 ? (
        <div className="text-center py-12 bg-stone-100 dark:bg-stone-900 rounded-2xl text-stone-400 text-sm">
          No hay horarios cargados todavía.
        </div>
      ) : (
        <>
          {/* Calendar */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-500 dark:text-stone-400 text-lg"
              >
                ‹
              </button>
              <span className="font-medium text-stone-800 dark:text-stone-200 capitalize">
                {monthLabel}
              </span>
              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-500 dark:text-stone-400 text-lg"
              >
                ›
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-stone-400 dark:text-stone-500 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayData = slotsByDate[dateStr];
                const hasSlots = !!dayData;
                const hasAvailable = dayData?.some((s) => s.disponible);
                const isSelected = selectedDate === dateStr;
                const isToday =
                  today.getFullYear() === calYear &&
                  today.getMonth() === calMonth &&
                  today.getDate() === day;

                return (
                  <button
                    key={i}
                    onClick={() => hasSlots && selectDate(dateStr)}
                    disabled={!hasSlots}
                    className={`relative flex flex-col items-center justify-center h-10 rounded-xl text-sm transition-colors
                      ${isSelected
                        ? "bg-emerald-700 text-white"
                        : hasSlots
                        ? "hover:bg-emerald-50 dark:hover:bg-emerald-950 text-stone-700 dark:text-stone-200 cursor-pointer"
                        : "text-stone-300 dark:text-stone-600 cursor-default"}
                      ${isToday && !isSelected ? "font-bold ring-1 ring-inset ring-emerald-400" : ""}
                    `}
                  >
                    {day}
                    {hasSlots && (
                      <span
                        className={`absolute bottom-1 w-1 h-1 rounded-full ${
                          isSelected
                            ? "bg-white/60"
                            : hasAvailable
                            ? "bg-emerald-500"
                            : "bg-stone-400 dark:bg-stone-600"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
              <span className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Con disponibilidad
              </span>
              <span className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500">
                <span className="w-2 h-2 rounded-full bg-stone-400 dark:bg-stone-600 inline-block" />
                Sin disponibilidad
              </span>
            </div>
          </div>

          {/* Day detail */}
          {selectedDate ? (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
                {availableInDay.length > 0 && (
                  <input
                    type="checkbox"
                    checked={availableInDay.every((s) => selected.has(s.id))}
                    ref={(el) => {
                      if (el) {
                        const some = availableInDay.some((s) => selected.has(s.id));
                        const all = availableInDay.every((s) => selected.has(s.id));
                        el.indeterminate = some && !all;
                      }
                    }}
                    onChange={toggleDay}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                )}
                <span className="font-medium text-stone-800 dark:text-stone-200 capitalize">
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-CR", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
                </span>
                <span className="text-xs text-stone-400 dark:text-stone-500 ml-auto">
                  {availableInDay.length} disponible{availableInDay.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {daySlots.map((slot) => (
                  <div
                    key={slot.id}
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
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        slot.disponible
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                      }`}
                    >
                      {slot.disponible ? "Disponible" : "Reservado"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-4">
              Selecciona un día en el calendario para ver sus horarios.
            </p>
          )}
        </>
      )}

      {/* Floating delete bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-stone-900 dark:bg-stone-950 text-white px-6 py-3 rounded-full shadow-2xl border border-stone-700">
          <span className="text-sm font-medium">
            {selected.size} seleccionado{selected.size !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setSelected(new Set())}
            className="text-stone-400 hover:text-white text-sm transition-colors"
          >
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
