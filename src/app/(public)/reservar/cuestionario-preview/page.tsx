"use client";

import { useState } from "react";

export default function CuestionarioPreview() {
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
  const [done, setDone] = useState(false);

  const inputClass =
    "w-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-stone-400 dark:placeholder:text-stone-600 text-sm";

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">¡Formulario completo!</h2>
          <p className="text-stone-500 dark:text-stone-400">Así se verá la confirmación cuando un cliente termine de llenarlo.</p>
          <button
            onClick={() => { setDone(false); setIntake({ tema:"", paisResidencia:"", nacionalidad:"", profesion:"", edad:"", nombrePadre:"", nombreMadre:"", tieneHijos:"", numeroHijos:"", nombresHijos:"", lugarEntreHermanos:"", estadoCivil:"", nombrePareja:"", tiempoRelacion:"" }); }}
            className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Volver a empezar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      {/* Preview banner */}
      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
        <span className="font-semibold">Modo vista previa</span>
        <span className="text-amber-600 dark:text-amber-400">— los datos no se guardarán.</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Cuestionario previo a la sesión</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">Así verá este formulario el cliente después de pagar.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setDone(true); }}
        className="space-y-8"
      >
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl px-5 py-4 text-sm text-emerald-800 dark:text-emerald-300">
          <p className="font-semibold mb-1">¡Pago recibido! Un paso más</p>
          <p>Para preparar tu sesión, la consteladora necesita conocerte un poco antes. Completa este cuestionario con calma y honestidad.</p>
        </div>

        {/* Sección 1 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-stone-700 pb-2">Sobre tu sesión</h3>
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

        {/* Sección 2 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-stone-700 pb-2">Datos personales</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Edad <span className="text-red-400">*</span></label>
              <input type="number" min="1" max="120" value={intake.edad} onChange={(e) => setIntake({ ...intake, edad: e.target.value })} placeholder="Ej. 34" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Profesión</label>
              <input type="text" value={intake.profesion} onChange={(e) => setIntake({ ...intake, profesion: e.target.value })} placeholder="Ej. Docente, Ingeniero/a..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">País donde vives</label>
              <input type="text" value={intake.paisResidencia} onChange={(e) => setIntake({ ...intake, paisResidencia: e.target.value })} placeholder="Ej. Costa Rica" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nacionalidad</label>
              <input type="text" value={intake.nacionalidad} onChange={(e) => setIntake({ ...intake, nacionalidad: e.target.value })} placeholder="Ej. Costarricense" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Sección 3 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-stone-700 pb-2">Familia de origen</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nombre del padre</label>
              <input type="text" value={intake.nombrePadre} onChange={(e) => setIntake({ ...intake, nombrePadre: e.target.value })} placeholder="Nombre completo" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nombre de la madre</label>
              <input type="text" value={intake.nombreMadre} onChange={(e) => setIntake({ ...intake, nombreMadre: e.target.value })} placeholder="Nombre completo" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">¿Qué lugar ocupas entre tus hermanos?</label>
            <input type="number" min="1" value={intake.lugarEntreHermanos} onChange={(e) => setIntake({ ...intake, lugarEntreHermanos: e.target.value })} placeholder="Ej. 1 si eres el/la mayor, 2 si eres el/la segundo/a..." className={inputClass} />
          </div>
        </div>

        {/* Sección 4 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-stone-700 pb-2">Familia actual</h3>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Estado civil <span className="text-red-400">*</span></label>
            <select value={intake.estadoCivil} onChange={(e) => setIntake({ ...intake, estadoCivil: e.target.value, nombrePareja: "", tiempoRelacion: "" })} className={inputClass}>
              <option value="">Selecciona una opción</option>
              <option value="soltero">Soltero/a</option>
              <option value="casado">Casado/a</option>
              <option value="union_libre">Unión libre</option>
              <option value="divorciado">Divorciado/a</option>
              <option value="separado">Separado/a</option>
              <option value="viudo">Viudo/a</option>
            </select>
          </div>

          {intake.estadoCivil && intake.estadoCivil !== "soltero" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nombre de tu pareja</label>
                <input type="text" value={intake.nombrePareja} onChange={(e) => setIntake({ ...intake, nombrePareja: e.target.value })} placeholder="Nombre completo" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Tiempo de relación</label>
                <input type="text" value={intake.tiempoRelacion} onChange={(e) => setIntake({ ...intake, tiempoRelacion: e.target.value })} placeholder="Ej. 3 años, 8 meses..." className={inputClass} />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              ¿Tienes hijos? <span className="text-xs font-normal text-stone-400">(incluye no nacidos)</span> <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-3">
              {(["si", "no"] as const).map((v) => (
                <button key={v} type="button"
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
                <input type="number" min="1" value={intake.numeroHijos} onChange={(e) => setIntake({ ...intake, numeroHijos: e.target.value })} placeholder="Ej. 2" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Nombres de tus hijos <span className="text-xs font-normal text-stone-400">(incluye no nacidos)</span>
                </label>
                <textarea value={intake.nombresHijos} onChange={(e) => setIntake({ ...intake, nombresHijos: e.target.value })} rows={3} placeholder="Escribe el nombre de cada hijo/a, uno por línea..." className={inputClass + " resize-none"} />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-emerald-700 text-white py-4 rounded-xl font-medium hover:bg-emerald-600 transition-colors text-lg">
          Enviar y confirmar sesión
        </button>
        <p className="text-xs text-center text-stone-400 dark:text-stone-500">
          Esta información es confidencial y solo será vista por la consteladora.
        </p>
      </form>
    </div>
  );
}
