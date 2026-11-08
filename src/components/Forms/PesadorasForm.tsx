import React from 'react';
import { ChevronDown, CheckCircle2, AlertOctagon, Scale, Calendar } from 'lucide-react';
import { J, wa, Ia } from '../../constants/data';
import { Re, g } from '../../utils/calc';

interface PesadorasFormProps {
  v: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const PesadorasForm: React.FC<PesadorasFormProps> = ({ v, onChange }) => {
  const result = Re(v);

  const renderSampleTable = (prefix: 'a' | 'b', count: number, title: string) => {
    const dataSubset = (result as any)[prefix];
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h4 className="mb-4 text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Scale className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          {title}
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-2.5 px-3 min-w-[180px]">Variable</th>
                {[...Array(count)].map((_, i) => (
                  <th key={i} className="py-2.5 px-3 min-w-[110px] text-center">
                    Muestra {i + 1}
                  </th>
                ))}
                <th className="py-2.5 px-3 min-w-[110px] text-center bg-slate-100 dark:bg-slate-800/80 rounded-t-lg">
                  Promedio
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {J.map(([code, label, hasInput]) => {
                const avgVal = dataSubset.A[code];
                return (
                  <tr key={code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {label}
                    </td>

                    {[...Array(count)].map((_, idx) => {
                      const inputKey = `p_${prefix}${code}_${idx}`;
                      const sampleVal = dataSubset.cs[idx][code];

                      return (
                        <td key={idx} className="py-1.5 px-2 text-center">
                          {hasInput ? (
                            <input
                              type="text"
                              inputMode="decimal"
                              value={v[inputKey] || ""}
                              onChange={e => onChange(inputKey, e.target.value)}
                              placeholder="0.00"
                              className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center text-xs font-semibold text-slate-800 focus:border-cyan-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            />
                          ) : (
                            <div className="rounded-lg bg-slate-100 py-1.5 px-2 text-center text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {g(sampleVal, 2) || "—"}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-1.5 px-2 text-center bg-slate-50/80 dark:bg-slate-800/50 font-bold text-cyan-800 dark:text-cyan-300">
                      {g(avgVal, 2) || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Datos generales */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100">
          Datos de la Verificación
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {wa.map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                {label}
              </label>
              <input
                type={type === "date" ? "date" : "text"}
                inputMode={type === "d" ? "decimal" : undefined}
                value={v[key] || ""}
                onChange={e => onChange(key, e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Muestras sin corrección */}
      {renderSampleTable("a", 3, "Pesadas de material SIN corrección (3 muestras)")}

      {/* Muestras con corrección */}
      {renderSampleTable("b", 1, "Pesadas de material DESPUÉS de corrección (1 muestra)")}

      {/* Resultados */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100">
          Dictamen y Resultados
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Valor Final Factor K
            </span>
            <span className="text-xl font-extrabold text-cyan-800 dark:text-cyan-300">
              {result.kf == null ? "—" : result.kf.toFixed(5)}
            </span>
            <p className="mt-1 text-[11px] text-slate-500">
              Calculado: (Neto promedio / Registro pesadora promedio) × Factor K inicial
            </p>
          </div>

          <div
            className={`rounded-xl border p-4 ${
              result.ok === true
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                : result.ok === false
                ? "border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30"
                : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Resultado de Verificación
              </span>
              {result.ok === true && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ACEPTABLE
                </span>
              )}
              {result.ok === false && (
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-bold text-white">
                  <AlertOctagon className="h-3.5 w-3.5" /> NO ACEPTABLE (Warning)
                </span>
              )}
            </div>

            <div className="mt-2 space-y-1 text-xs">
              <p>
                Error sin corrección: <b>{g(result.pa, 2) || "—"} %</b>{" "}
                {result.oka != null && (
                  <span className={result.oka ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}>
                    ({result.oka ? "dentro de tolerancia" : "fuera de tolerancia"})
                  </span>
                )}
              </p>
              <p>
                Error después de corrección: <b>{g(result.pe, 2) || "—"} %</b>{" "}
                (tolerancia ± {result.tol ?? "1"} %)
              </p>
              {result.venc && (
                <p className={result.vencido ? "text-rose-600 font-bold" : "text-slate-500"}>
                  Vigencia del patrón: {result.vencido ? `VENCIDO (${result.venc})` : `vigente hasta ${result.venc}`}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs mb-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Acción tomada
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange("p_acc", "ver")}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  v.p_acc === "ver"
                    ? "bg-cyan-700 text-white"
                    : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                Verificación
              </button>
              <button
                type="button"
                onClick={() => onChange("p_acc", "cal")}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  v.p_acc === "cal"
                    ? "bg-cyan-700 text-white"
                    : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                Calibración
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Tolerancia aceptable (± %)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={v.p_tol || "1"}
              onChange={e => onChange("p_tol", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Próxima verificación
            </label>
            <input
              type="date"
              value={v.p_prox || ""}
              onChange={e => onChange("p_prox", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Observaciones
            </label>
            <textarea
              rows={2}
              value={v.p_obs || ""}
              onChange={e => onChange("p_obs", e.target.value)}
              placeholder="Detalles sobre las pesadas o ajustes..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Autorizado por
            </label>
            <input
              type="text"
              value={v.p_aut || ""}
              onChange={e => onChange("p_aut", e.target.value)}
              placeholder="Nombre del responsable de autorización"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Detalles del equipo y del patrón */}
      <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 group">
        <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-slate-800 dark:text-slate-100">
          <span>Datos del Equipo Bajo Verificación y Patrones Utilizados</span>
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 text-slate-500" />
        </summary>
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {Ia.map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                {label}
              </label>
              <input
                type={type === "date" ? "date" : "text"}
                inputMode={type === "d" ? "decimal" : undefined}
                value={v[key] || ""}
                onChange={e => onChange(key, e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};
