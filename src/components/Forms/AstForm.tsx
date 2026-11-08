import React, { useState } from 'react';
import { ShieldAlert, Plus, Trash2, PenTool, CheckCircle2, AlertOctagon } from 'lucide-react';
import { Da, We } from '../../constants/data';
import { ve, de, we, Qa } from '../../utils/calc';
import { SignatureModal } from '../SignatureModal';
import { setCachedBlob, removeCachedBlob, getBlobUrl } from '../../utils/storage';

interface AstFormProps {
  v: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const AstForm: React.FC<AstFormProps> = ({ v, onChange }) => {
  const [activeSigKey, setActiveSigKey] = useState<string | null>(null);

  const numSteps = de(v);
  const numWorkers = we(v);
  const isDuplicateApprover = Qa(v);

  const handleAddHazard = (stepIdx: number, hazardText: string) => {
    if (!hazardText) return;
    const currentHazards: string[] = v["a_h" + stepIdx] || [];
    if (!currentHazards.includes(hazardText)) {
      onChange("a_h" + stepIdx, [...currentHazards, hazardText]);
    }
  };

  const handleRemoveHazard = (stepIdx: number, itemIdx: number) => {
    const currentHazards: string[] = v["a_h" + stepIdx] || [];
    const updated = currentHazards.filter((_, idx) => idx !== itemIdx);
    onChange("a_h" + stepIdx, updated);
  };

  const handleSaveSignature = async (sigKey: string, blob: Blob) => {
    await setCachedBlob("sig:" + sigKey, blob);
    onChange(sigKey, "1");
  };

  const handleDeleteSignature = async (sigKey: string) => {
    await removeCachedBlob("sig:" + sigKey);
    onChange(sigKey, "");
  };

  return (
    <div className="space-y-6">
      {/* Datos generales */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Datos Generales del AST
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
          {Da.map(([key, label]) => (
            <div key={key}>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                {label}
              </label>
              <input
                type="text"
                value={v[key] || ""}
                onChange={e => onChange(key, e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            Descripción de la actividad a realizar
          </label>
          <textarea
            rows={2}
            value={v.a_des || ""}
            onChange={e => onChange("a_des", e.target.value)}
            placeholder="Describa el trabajo a ejecutar, equipos a intervenir y alcance..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Pasos de la actividad */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Pasos de la Actividad y Matriz de Riesgo
            </h3>
            <p className="text-xs text-slate-500">
              Si el nivel de riesgo S×P es 10 o mayor, no se puede iniciar la actividad sin controles adicionales
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("a_n", Math.min(15, numSteps + 1))}
            disabled={numSteps >= 15}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-cyan-800 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Agregar paso
          </button>
        </div>

        <div className="space-y-4">
          {[...Array(numSteps)].map((_, sIdx) => {
            const hazards: string[] = v["a_h" + sIdx] || [];
            const rInit = ve(v[`a_s${sIdx}_0`], v[`a_q${sIdx}_0`]);
            const rAdd = ve(v[`a_s${sIdx}_1`], v[`a_q${sIdx}_1`]);

            return (
              <div
                key={sIdx}
                className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-800/30"
              >
                <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 pb-2 dark:border-slate-800">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-cyan-800 dark:text-cyan-300">
                    Paso #{sIdx + 1}
                  </span>
                  {sIdx >= 3 && sIdx === numSteps - 1 && (
                    <button
                      type="button"
                      onClick={() => onChange("a_n", Math.max(1, numSteps - 1))}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      Quitar paso
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Paso de la actividad
                    </label>
                    <input
                      type="text"
                      value={v["a_pa" + sIdx] || ""}
                      onChange={e => onChange("a_pa" + sIdx, e.target.value)}
                      placeholder="ej. Bloqueo y etiquetado (LOTO)..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  {/* Peligros */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Peligros identificados
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {hazards.map((hTxt, hIdx) => (
                        <span
                          key={hIdx}
                          className="inline-flex items-center gap-1 rounded-md bg-cyan-100 px-2 py-0.5 text-[11px] font-medium text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200"
                        >
                          {hTxt}
                          <button
                            type="button"
                            onClick={() => handleRemoveHazard(sIdx, hIdx)}
                            className="text-cyan-700 hover:text-rose-600 dark:text-cyan-300 ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <select
                      value=""
                      onChange={e => {
                        if (e.target.value) {
                          const [catIdx, itemIdx] = e.target.value.split(".").map(Number);
                          handleAddHazard(sIdx, We[catIdx][1][itemIdx]);
                        }
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="">+ Seleccionar y agregar peligro...</option>
                      {We.map(([cat, list], cIdx) => (
                        <optgroup key={cIdx} label={cat}>
                          {list.map((item, iIdx) => (
                            <option key={iIdx} value={`${cIdx}.${iIdx}`}>
                              {item}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Controles implementados & Evaluación 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Controles implementados (NO SOLO EPP)
                      </label>
                      <textarea
                        rows={2}
                        value={v["a_co" + sIdx] || ""}
                        onChange={e => onChange("a_co" + sIdx, e.target.value)}
                        placeholder="Controles de ingeniería, procedimientos, LOTO..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Evaluación de Riesgo Inicial
                      </span>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <select
                          value={v[`a_s${sIdx}_0`] || ""}
                          onChange={e => onChange(`a_s${sIdx}_0`, e.target.value)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="">Severidad (S)</option>
                          <option value="1">1 Insignificante</option>
                          <option value="2">2 Menor</option>
                          <option value="3">3 Moderado</option>
                          <option value="4">4 Mayor</option>
                          <option value="5">5 Catastrófico</option>
                        </select>
                        <select
                          value={v[`a_q${sIdx}_0`] || ""}
                          onChange={e => onChange(`a_q${sIdx}_0`, e.target.value)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="">Probabilidad (P)</option>
                          <option value="1">1 Raro</option>
                          <option value="2">2 Improbable</option>
                          <option value="3">3 Posible</option>
                          <option value="4">4 Probable</option>
                          <option value="5">5 Casi seguro</option>
                        </select>
                      </div>

                      {rInit && (
                        <div
                          className={`rounded-lg p-2 text-xs font-bold flex items-center justify-between ${
                            rInit.k === "good"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : rInit.k === "warn"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : rInit.k === "or"
                              ? "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          <span>S×P = {rInit.v} ({rInit.n})</span>
                          {rInit.v >= 10 && (
                            <span className="text-[10px] text-rose-700 font-extrabold uppercase">
                              ¡Requiere controles adicionales!
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Controles adicionales & Evaluación 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Controles adicionales
                      </label>
                      <textarea
                        rows={2}
                        value={v["a_ad" + sIdx] || ""}
                        onChange={e => onChange("a_ad" + sIdx, e.target.value)}
                        placeholder="Supervisión continua, vigía, rediseño de maniobra..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Evaluación Residual (con adicionales)
                      </span>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <select
                          value={v[`a_s${sIdx}_1`] || ""}
                          onChange={e => onChange(`a_s${sIdx}_1`, e.target.value)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="">Severidad (S)</option>
                          <option value="1">1 Insignificante</option>
                          <option value="2">2 Menor</option>
                          <option value="3">3 Moderado</option>
                          <option value="4">4 Mayor</option>
                          <option value="5">5 Catastrófico</option>
                        </select>
                        <select
                          value={v[`a_q${sIdx}_1`] || ""}
                          onChange={e => onChange(`a_q${sIdx}_1`, e.target.value)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="">Probabilidad (P)</option>
                          <option value="1">1 Raro</option>
                          <option value="2">2 Improbable</option>
                          <option value="3">3 Posible</option>
                          <option value="4">4 Probable</option>
                          <option value="5">5 Casi seguro</option>
                        </select>
                      </div>

                      {rAdd && (
                        <div
                          className={`rounded-lg p-2 text-xs font-bold flex items-center justify-between ${
                            rAdd.k === "good"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : rAdd.k === "warn"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : rAdd.k === "or"
                              ? "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          <span>S×P = {rAdd.v} ({rAdd.n})</span>
                          {rAdd.v >= 10 && (
                            <span className="text-[10px] text-rose-700 font-extrabold uppercase">
                              No se puede iniciar
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Involucrado y Firmas */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Personal Ejecutante Involucrado
          </h3>
          <button
            type="button"
            onClick={() => onChange("a_ne", Math.min(10, numWorkers + 1))}
            disabled={numWorkers >= 10}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-cyan-800 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Agregar ejecutante
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[...Array(numWorkers)].map((_, wIdx) => {
            const sigKey = "a_es" + wIdx;
            const hasSig = !!v[sigKey];
            const sigUrl = getBlobUrl("sig:" + sigKey);

            return (
              <div
                key={wIdx}
                className="rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/20 text-xs"
              >
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Ejecutante #{wIdx + 1}: Nombre
                </label>
                <input
                  type="text"
                  value={v["a_en" + wIdx] || ""}
                  onChange={e => onChange("a_en" + wIdx, e.target.value)}
                  placeholder="Nombre y apellido"
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 mb-2"
                />

                <div className="flex items-center justify-between gap-2">
                  {hasSig && sigUrl ? (
                    <img
                      src={sigUrl}
                      alt="Firma"
                      className="h-10 w-28 object-contain rounded border border-slate-200 bg-white dark:border-slate-700"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Sin firma</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveSigKey(sigKey)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <PenTool className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" />
                    {hasSig ? "Re-firmar" : "Firmar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revisado por & Autorizado por */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/30 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-100 block mb-2">
              Revisado por
            </span>
            <div className="space-y-2 mb-3">
              <div>
                <label className="text-[10px] text-slate-500">Nombre</label>
                <input
                  type="text"
                  value={v.a_rn || ""}
                  onChange={e => onChange("a_rn", e.target.value)}
                  placeholder="Nombre del revisor"
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Puesto</label>
                <input
                  type="text"
                  value={v.a_rp || ""}
                  onChange={e => onChange("a_rp", e.target.value)}
                  placeholder="Puesto / cargo"
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {v.a_rs && getBlobUrl("sig:a_rs") ? (
                <img
                  src={getBlobUrl("sig:a_rs")}
                  alt="Firma Revisor"
                  className="h-10 w-28 object-contain rounded border border-slate-200 bg-white dark:border-slate-700"
                />
              ) : (
                <span className="text-[11px] text-slate-400 italic">Sin firma</span>
              )}

              <button
                type="button"
                onClick={() => setActiveSigKey("a_rs")}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <PenTool className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" />
                {v.a_rs ? "Re-firmar" : "Firmar"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/30 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-100 block mb-2">
              Autorizado por
            </span>
            <div className="space-y-2 mb-3">
              <div>
                <label className="text-[10px] text-slate-500">Nombre</label>
                <input
                  type="text"
                  value={v.a_an || ""}
                  onChange={e => onChange("a_an", e.target.value)}
                  placeholder="Nombre del autorizador"
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Puesto</label>
                <input
                  type="text"
                  value={v.a_ap || ""}
                  onChange={e => onChange("a_ap", e.target.value)}
                  placeholder="Puesto / cargo"
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {v.a_as && getBlobUrl("sig:a_as") ? (
                <img
                  src={getBlobUrl("sig:a_as")}
                  alt="Firma Autorizador"
                  className="h-10 w-28 object-contain rounded border border-slate-200 bg-white dark:border-slate-700"
                />
              ) : (
                <span className="text-[11px] text-slate-400 italic">Sin firma</span>
              )}

              <button
                type="button"
                onClick={() => setActiveSigKey("a_as")}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <PenTool className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" />
                {v.a_as ? "Re-firmar" : "Firmar"}
              </button>
            </div>
          </div>
        </div>

        {isDuplicateApprover && (
          <p className="mt-3 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <AlertOctagon className="h-4 w-4" />
            El revisor y el autorizador deben ser personas distintas.
          </p>
        )}
      </div>

      {activeSigKey && (
        <SignatureModal
          sigKey={activeSigKey}
          hasExisting={!!v[activeSigKey]}
          onClose={() => setActiveSigKey(null)}
          onSave={blob => handleSaveSignature(activeSigKey, blob)}
          onDelete={() => handleDeleteSignature(activeSigKey)}
        />
      )}
    </div>
  );
};
