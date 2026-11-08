import React from 'react';
import { ChevronDown, CheckCircle2, AlertOctagon, AlertTriangle, Flame } from 'lucide-react';
import { B, se, he } from '../../constants/data';
import { ce, le, ee, g } from '../../utils/calc';

interface GasesFormProps {
  v: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const GasesForm: React.FC<GasesFormProps> = ({ v, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Configuración */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Flame className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Configuración de la Verificación
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Línea
            </label>
            <input
              type="text"
              value={v.g_lin || "L1"}
              onChange={e => onChange("g_lin", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Porcentaje de error aceptable (± %)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={v.g_tol || "4"}
              onChange={e => onChange("g_tol", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <span className="text-[10px] text-slate-400">
              Desviaciones mayores se marcan automáticamente como ERROR
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Orientación del PDF
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange("g_ori", "v")}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  v.g_ori !== "h"
                    ? "bg-cyan-700 text-white"
                    : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                Vertical
              </button>
              <button
                type="button"
                onClick={() => onChange("g_ori", "h")}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  v.g_ori === "h"
                    ? "bg-cyan-700 text-white"
                    : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                Horizontal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gases individuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {B.map(([gasId, name]) => {
          const pressStatus = le(v, gasId);
          const gasMeasurements = se.filter(a => a[1] === gasId);

          return (
            <div
              key={gasId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {name}
                </h4>
                {pressStatus === "good" && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> Presión OK
                  </span>
                )}
                {pressStatus === "warn" && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <AlertTriangle className="h-3 w-3" /> Presión baja (500-700 psi)
                  </span>
                )}
                {pressStatus === "bad" && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    <AlertOctagon className="h-3 w-3" /> Warning (&lt; 500 psi)
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Presión del cilindro (PSI)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v["g_ps_" + gasId] || ""}
                  onChange={e => onChange("g_ps_" + gasId, e.target.value)}
                  placeholder="ej. 1800"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              {gasId === "toc" && (
                <p className="mb-3 text-[11px] text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 p-2 rounded-lg">
                  El Span del TOC se verifica en el menú de calibración manual.
                </p>
              )}

              <div className="space-y-3">
                {gasMeasurements.map(([measKey, , type, unit]) => {
                  const evalRes = ce(v, measKey);
                  const isO2Span = measKey === "o2s";
                  const inputPatternKey = isO2Span ? "g_p_o2s" : null;

                  return (
                    <div
                      key={measKey}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {type} ({unit})
                        </span>
                        {evalRes.st === "good" && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            Correcto ({g(evalRes.e, 2)} %)
                          </span>
                        )}
                        {evalRes.st === "bad" && (
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            ERROR ({g(evalRes.e, 2)} %)
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="block text-[10px] text-slate-400 mb-0.5">Patrón</span>
                          {inputPatternKey ? (
                            <input
                              type="text"
                              inputMode="decimal"
                              value={v[inputPatternKey] || "20.96"}
                              onChange={e => onChange(inputPatternKey, e.target.value)}
                              className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-center font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            />
                          ) : (
                            <div className="rounded-lg bg-slate-200/60 py-1 text-center font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                              {g(evalRes.p, 2) || "0"}
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="block text-[10px] text-slate-400 mb-0.5">Real medido</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={v["g_r_" + measKey] || ""}
                            onChange={e => onChange("g_r_" + measKey, e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-center font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                          />
                        </div>

                        <div>
                          <span className="block text-[10px] text-slate-400 mb-0.5">Error</span>
                          <div
                            className={`rounded-lg py-1 text-center font-bold ${
                              evalRes.st === "good"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : evalRes.st === "bad"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                : "bg-slate-200/60 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {evalRes.e != null
                              ? `${g(evalRes.e, 2)} %`
                              : evalRes.d != null
                              ? `dif. ${g(evalRes.d, 2)}`
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ajustes y Observaciones */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100">
          Ajustes Realizados y Observaciones
        </h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            type="button"
            onClick={() => onChange("g_adz", v.g_adz ? "" : "1")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              v.g_adz
                ? "bg-cyan-700 text-white shadow-xs"
                : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {v.g_adz ? "✓ Se ajustó Zero O2" : "+ Se ajustó Zero O2"}
          </button>
          <button
            type="button"
            onClick={() => onChange("g_ads", v.g_ads ? "" : "1")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              v.g_ads
                ? "bg-cyan-700 text-white shadow-xs"
                : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {v.g_ads ? "✓ Se ajustó Span O2" : "+ Se ajustó Span O2"}
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            Observaciones
          </label>
          <textarea
            rows={2}
            value={v.g_obs || ""}
            onChange={e => onChange("g_obs", e.target.value)}
            placeholder="Comentarios adicionales sobre la verificación o cilindros..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Tabla de gases patrón usados */}
      <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 group">
        <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-slate-800 dark:text-slate-100">
          <span>Gases Patrón Utilizados (Concentración y Peso Molecular)</span>
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 text-slate-500" />
        </summary>
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-2 px-3">Gas</th>
                <th className="py-2 px-3">Concentración</th>
                <th className="py-2 px-3">Peso Molecular</th>
                <th className="py-2 px-3">mg/m³ (calculado)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {he.map(([gasId, name, unit, hasPm]) => (
                <tr key={gasId}>
                  <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">
                    {name}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={v["g_c_" + gasId] || ""}
                        onChange={e => onChange("g_c_" + gasId, e.target.value)}
                        className="w-24 rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                      <span className="text-slate-500 text-[11px]">{unit}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    {hasPm ? (
                      <input
                        type="text"
                        inputMode="decimal"
                        value={v["g_m_" + gasId] || ""}
                        onChange={e => onChange("g_m_" + gasId, e.target.value)}
                        className="w-24 rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2 px-3 font-bold text-cyan-800 dark:text-cyan-300">
                    {hasPm ? g(ee(v, gasId), 2) || "—" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
};
