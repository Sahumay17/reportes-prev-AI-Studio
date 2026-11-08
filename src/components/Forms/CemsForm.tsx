import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Sparkles } from 'lucide-react';
import { K, Y, oe, re, Ze } from '../../constants/data';
import { Ae, CemsEvaluationItem } from '../../utils/calc';

interface CemsFormProps {
  v: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onBatchUpdate: (updates: Record<string, any>) => void;
}

export const CemsForm: React.FC<CemsFormProps> = ({ v, onChange, onBatchUpdate }) => {
  const evalItems = Ae(v);
  const evalMap = new Map<string, CemsEvaluationItem>(evalItems.map(item => [item.id, item]));

  const handleMarkAllOk = () => {
    const updates: Record<string, any> = {};
    K.forEach((_, dailyIdx) => {
      Y.forEach((_, dayIdx) => {
        updates[`d${dailyIdx}_${dayIdx}`] = "ok";
      });
    });
    oe.forEach(([id, , type]) => {
      if (type === "ok") {
        updates[id] = "ok";
      }
    });
    onBatchUpdate(updates);
  };

  const cycleStatus = (key: string) => {
    const current = v[key];
    const next = current === "ok" ? "obs" : current === "obs" ? "" : "ok";
    onChange(key, next);
  };

  let lastSectionHeader = "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 dark:border-cyan-900/40 dark:bg-cyan-950/20">
        <div>
          <h3 className="text-sm font-bold text-cyan-900 dark:text-cyan-200">
            TC.421-2K1 Inspección CEM’s
          </h3>
          <p className="text-xs text-cyan-700/80 dark:text-cyan-400">
            Rutina preventiva diaria, semanal y monitoreo de cilindros de gases patrón
          </p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllOk}
          className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-cyan-800 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Marcar todos los checks como OK
        </button>
      </div>

      {/* Revisión diaria */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
            1
          </span>
          Revisión Diaria (Lunes a Viernes)
        </h3>

        <div className="space-y-3">
          {K.map((itemText, idx) => {
            const rowEval = evalMap.get("d" + idx);
            const isBad = rowEval?.st === "bad";
            return (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition-all ${
                  isBad
                    ? "border-rose-300 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20"
                    : "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {itemText}
                  </span>
                  {isBad && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      <AlertOctagon className="h-3 w-3" /> Revisar
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {Y.map((dayLabel, dayIdx) => {
                    const key = `d${idx}_${dayIdx}`;
                    const val = v[key];
                    return (
                      <button
                        key={dayIdx}
                        type="button"
                        onClick={() => cycleStatus(key)}
                        className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                          val === "ok"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : val === "obs"
                            ? "bg-rose-600 text-white shadow-xs"
                            : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {dayLabel} {val ? val.toUpperCase() : ""}
                      </button>
                    );
                  })}
                </div>

                {(isBad || v[`d${idx}_o`]) && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Observaciones de la anomalía..."
                      value={v[`d${idx}_o`] || ""}
                      onChange={e => onChange(`d${idx}_o`, e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revisión semanal */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
            2
          </span>
          Revisión Semanal
        </h3>

        <div className="space-y-3">
          {oe.map(([id, title, type, minVal, maxVal]) => {
            const prefix = title.split(" ")[0];
            const hasSectionTitle = Ze[prefix] && prefix !== lastSectionHeader;
            if (hasSectionTitle) {
              lastSectionHeader = prefix;
            }

            const itemEval = evalMap.get(id);
            const isBad = itemEval?.st === "bad";
            const isGood = itemEval?.st === "good";

            return (
              <React.Fragment key={id}>
                {hasSectionTitle && (
                  <div className="pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 border-t border-slate-100 dark:border-slate-800">
                    {Ze[prefix]}
                  </div>
                )}

                <div
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
                        {title}
                      </span>
                      {type === "n" && (minVal !== undefined || maxVal !== undefined) && (
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                          Rango permitido: {minVal ?? "-"} {maxVal !== undefined ? `a ${maxVal}` : "mínimo"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {type === "ok" ? (
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => onChange(id, v[id] === "ok" ? "" : "ok")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                              v[id] === "ok"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            OK
                          </button>
                          <button
                            type="button"
                            onClick={() => onChange(id, v[id] === "obs" ? "" : "obs")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                              v[id] === "obs"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            Obs
                          </button>
                        </div>
                      ) : (
                        <div className="w-32">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={v[id] || ""}
                            onChange={e => onChange(id, e.target.value)}
                            placeholder="Valor"
                            className={`w-full rounded-lg border px-3 py-1.5 text-center text-xs font-semibold ${
                              isBad
                                ? "border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200"
                                : isGood
                                ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
                                : "border-slate-300 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                            }`}
                          />
                        </div>
                      )}

                      {isGood && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                      {isBad && <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0" />}
                    </div>
                  </div>

                  {(isBad || v[id + "_o"]) && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Observación..."
                        value={v[id + "_o"] || ""}
                        onChange={e => onChange(id + "_o", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Gases */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
            3
          </span>
          Cilindros de Gases (Cuarto CEM’s)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {re.map(([gasId, name, conc, outPress, hasExp]) => {
            const itemEval = evalMap.get(gasId);
            const isBad = itemEval?.st === "bad";
            const isWarn = itemEval?.st === "warn";
            const isGood = itemEval?.st === "good";

            return (
              <div
                key={gasId}
                className={`rounded-xl border p-4 transition-all ${
                  isBad
                    ? "border-rose-300 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20"
                    : isWarn
                    ? "border-amber-300 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/20"
                    : "border-slate-200 bg-slate-50/30 dark:border-slate-800 dark:bg-slate-800/30"
                }`}
              >
                <div className="mb-3 flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      Gas {name}
                    </h4>
                    {conc && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {conc}
                      </span>
                    )}
                  </div>
                  {isBad && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      <AlertOctagon className="h-3 w-3" /> Warning
                    </span>
                  )}
                  {isWarn && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      <AlertTriangle className="h-3 w-3" /> Precaución
                    </span>
                  )}
                  {isGood && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Correcto
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      Presión total (PSI)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={v[gasId + "_t"] || ""}
                      onChange={e => onChange(gasId + "_t", e.target.value)}
                      placeholder="ej. 1500"
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>

                  {outPress ? (
                    <div>
                      <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        Salida ({outPress} bar)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={v[gasId + "_s"] || ""}
                        onChange={e => onChange(gasId + "_s", e.target.value)}
                        placeholder="bar"
                        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                  ) : (
                    <div />
                  )}

                  {hasExp ? (
                    <div>
                      <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        Caducidad
                      </label>
                      <input
                        type="date"
                        value={v[gasId + "_e"] || ""}
                        onChange={e => onChange(gasId + "_e", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                  ) : (
                    <div />
                  )}
                </div>

                {itemEval?.why && (
                  <p className="mt-2 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    {itemEval.why}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
