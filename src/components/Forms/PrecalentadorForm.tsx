import React from 'react';
import { Activity, CheckCircle2, AlertOctagon, AlertTriangle } from 'lucide-react';
import { ie, xe, V } from '../../constants/data';
import { Ie, ke, g } from '../../utils/calc';

interface PrecalentadorFormProps {
  eqKey: 'h' | 'i';
  v: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onBatchUpdate: (updates: Record<string, any>) => void;
}

export const PrecalentadorForm: React.FC<PrecalentadorFormProps> = ({
  eqKey,
  v,
  onChange,
  onBatchUpdate
}) => {
  const stepItems = Ie(v, eqKey);
  const gasEval = ke(v, eqKey);

  const handleMarkAllStepsOk = () => {
    const updates: Record<string, any> = {};
    stepItems.forEach(item => {
      updates[`${eqKey}_s${item.i}`] = "ok";
    });
    onBatchUpdate(updates);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 dark:border-cyan-900/40 dark:bg-cyan-950/20">
        <div>
          <h3 className="text-sm font-bold text-cyan-900 dark:text-cyan-200">
            {ie[eqKey].eq} Inspección Analizadores Precalentador
          </h3>
          <p className="text-xs text-cyan-700/80 dark:text-cyan-400">
            Inspección semanal (1S) y verificación mensual con gases patrón (1M)
          </p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllStepsOk}
          className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-cyan-800 transition-colors"
        >
          <CheckCircle2 className="h-4 w-4" /> Marcar todos los pasos como OK
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Identificación del Equipo
        </label>
        <input
          type="text"
          value={v[eqKey + "_eq"] || ie[eqKey].eq}
          onChange={e => onChange(eqKey + "_eq", e.target.value)}
          className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 mb-3"
        />
        <p className="text-xs text-slate-500">{xe}</p>
      </div>

      {/* 1. Inspección Semanal */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Inspección Semanal ({ie[eqKey].steps.length} puntos)
        </h3>

        <div className="space-y-3">
          {stepItems.map(item => {
            const isBad = item.st === "bad";
            const isGood = item.st === "good";

            return (
              <div
                key={item.i}
                className={`rounded-xl border p-4 transition-all ${
                  isBad
                    ? "border-rose-300 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20"
                    : isGood
                    ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    : "border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/20"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {item.t}
                    </span>
                    {item.v?.max && (
                      <span className="block text-[11px] text-slate-500">
                        {item.v.l} (límite: {item.v.strict ? "<" : "≤"} {item.v.max})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.v && (
                      <div className="w-28">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder={item.v.l}
                          value={v[`${eqKey}_v${item.i}`] || ""}
                          onChange={e => onChange(`${eqKey}_v${item.i}`, e.target.value)}
                          className={`w-full rounded border px-2 py-1 text-center text-xs font-bold ${
                            item.vs === "bad"
                              ? "border-rose-400 bg-rose-50 text-rose-900"
                              : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                          }`}
                        />
                      </div>
                    )}

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onChange(
                            `${eqKey}_s${item.i}`,
                            v[`${eqKey}_s${item.i}`] === "ok" ? "" : "ok"
                          )
                        }
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                          v[`${eqKey}_s${item.i}`] === "ok"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onChange(
                            `${eqKey}_s${item.i}`,
                            v[`${eqKey}_s${item.i}`] === "obs" ? "" : "obs"
                          )
                        }
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                          v[`${eqKey}_s${item.i}`] === "obs"
                            ? "bg-rose-600 text-white shadow-xs"
                            : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        Obs
                      </button>
                    </div>

                    {isGood && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                    {isBad && <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0" />}
                  </div>
                </div>

                {(isBad || v[`${eqKey}_o${item.i}`]) && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Observaciones de la anomalía..."
                      value={v[`${eqKey}_o${item.i}`] || ""}
                      onChange={e => onChange(`${eqKey}_o${item.i}`, e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Verificación con Gases Patrón (Mensual) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Verificación con Gases Patrón (Mensual)
            </h3>
            <p className="text-xs text-slate-500">
              Activa la opción cuando realices la prueba con cilindros patrón
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange(eqKey + "_mreal", "no")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                v[eqKey + "_mreal"] !== "si"
                  ? "bg-slate-700 text-white"
                  : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              No Realizado
            </button>
            <button
              type="button"
              onClick={() => onChange(eqKey + "_mreal", "si")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                v[eqKey + "_mreal"] === "si"
                  ? "bg-cyan-700 text-white shadow-xs"
                  : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Realizado
            </button>
          </div>
        </div>

        {gasEval.real && (
          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* Limpieza cuarto de tanques */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Realizar limpieza y sopleteo al cuarto de tanques
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => onChange(eqKey + "_lt", "ok")}
                  className={`rounded-lg px-3 py-1.5 font-bold ${
                    v[eqKey + "_lt"] === "ok"
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => onChange(eqKey + "_lt", "obs")}
                  className={`rounded-lg px-3 py-1.5 font-bold ${
                    v[eqKey + "_lt"] === "obs"
                      ? "bg-rose-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  Obs
                </button>
              </div>
            </div>

            {/* Tolerancia */}
            <div className="max-w-xs text-xs">
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Tolerancia aceptable (± %)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={v[eqKey + "_tol"] || "4"}
                onChange={e => onChange(eqKey + "_tol", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Gases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {V.map(gas => {
                const gItem = gasEval.g[gas.id];
                const prefix = `${eqKey}_g_${gas.id}_`;
                const isBad = gItem.st === "bad";

                return (
                  <div
                    key={gas.id}
                    className={`rounded-xl border p-4 text-xs transition-all ${
                      isBad
                        ? "border-rose-300 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20"
                        : "border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 pb-2 dark:border-slate-800">
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {gas.n} {gas.c ? `(${v[prefix + "c"] || gas.cd})` : ""}
                      </span>
                      {isBad && (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                          <AlertOctagon className="h-3 w-3" /> Revisar
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">
                            Presión total (PSI)
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={v[prefix + "t"] || ""}
                            onChange={e => onChange(prefix + "t", e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                          />
                        </div>

                        {gas.kind !== "p" && (
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">
                              Salida (2 bar)
                            </label>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={v[prefix + "s"] || ""}
                              onChange={e => onChange(prefix + "s", e.target.value)}
                              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                          </div>
                        )}
                      </div>

                      {gas.kind !== "p" && (
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">
                            Caducidad
                          </label>
                          <input
                            type="date"
                            value={v[prefix + "e"] || ""}
                            onChange={e => onChange(prefix + "e", e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                          />
                        </div>
                      )}

                      {gas.kind === "ie" && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">
                              Inicial
                            </label>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={v[prefix + "ini"] || ""}
                              onChange={e => onChange(prefix + "ini", e.target.value)}
                              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
                            />
                            {gItem.eI != null && (
                              <span className="block text-[10px] font-bold text-cyan-800 dark:text-cyan-300 mt-0.5">
                                Error: {g(gItem.eI, 2)} %
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">
                              Final (calibrado)
                            </label>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={v[prefix + "fin"] || ""}
                              onChange={e => onChange(prefix + "fin", e.target.value)}
                              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
                            />
                            {gItem.eF != null && (
                              <span className="block text-[10px] font-bold text-cyan-800 dark:text-cyan-300 mt-0.5">
                                Error: {g(gItem.eF, 2)} %
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {gas.kind === "zs" && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">
                              ZERO
                            </label>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={v[prefix + "z"] || ""}
                              onChange={e => onChange(prefix + "z", e.target.value)}
                              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
                            />
                            {gItem.eZ != null && (
                              <span className="block text-[10px] font-bold text-cyan-800 dark:text-cyan-300 mt-0.5">
                                Error: {g(gItem.eZ, 2)} %
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">
                              SPAN ({v[prefix + "sr"] || "20.96"})
                            </label>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={v[prefix + "sp"] || ""}
                              onChange={e => onChange(prefix + "sp", e.target.value)}
                              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
                            />
                            {gItem.eS != null && (
                              <span className="block text-[10px] font-bold text-cyan-800 dark:text-cyan-300 mt-0.5">
                                Error: {g(gItem.eS, 2)} %
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
