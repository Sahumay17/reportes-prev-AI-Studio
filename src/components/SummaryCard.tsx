import React from 'react';
import { CheckCircle2, AlertOctagon, AlertTriangle, Clock, Camera } from 'lucide-react';
import { ReportType, PhotoItem } from '../types';
import {
  Ae, Ge, Re, ce, le, Oe, Pe, Ja, Ie, ke, g, Xt
} from '../utils/calc';
import { B, se, V } from '../constants/data';

interface SummaryCardProps {
  currentTab: ReportType;
  v: Record<string, any>;
  photos: PhotoItem[];
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ currentTab, v, photos }) => {
  const renderSummaryContent = () => {
    switch (currentTab) {
      case 'c': {
        const items = Ae(v);
        const counts = Ge(items);
        const alerts = items.filter(r => r.st === 'bad' || r.st === 'warn');

        return (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> {counts.good} Correctos
              </span>
              {counts.warn > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" /> {counts.warn} Precaución
                </span>
              )}
              {counts.bad > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  <AlertOctagon className="h-3.5 w-3.5" /> {counts.bad} Warning / Revisar
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Clock className="h-3.5 w-3.5" /> {counts.pending} Pendientes
              </span>
            </div>

            {alerts.length > 0 && (
              <ul className="space-y-1 text-xs text-rose-700 dark:text-rose-300 list-disc list-inside">
                {alerts.map((a, i) => (
                  <li key={i}>
                    <b>{a.st === "bad" ? (a.sec === "Gases" ? "Warning" : "Revisar") : "Precaución"}:</b>{" "}
                    {a.t} {a.why ? `(${a.why})` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }

      case 'p': {
        const pEval = Re(v);
        return (
          <div className="space-y-2 text-xs">
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${
                  pEval.ok === true
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : pEval.ok === false
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {pEval.ok === true && <CheckCircle2 className="h-3.5 w-3.5" />}
                {pEval.ok === false && <AlertOctagon className="h-3.5 w-3.5" />}
                Error después de corrección: {g(pEval.pe, 2) || "—"} % ({pEval.ok === true ? "ACEPTABLE" : pEval.ok === false ? "NO ACEPTABLE" : "Sin cálculo"})
              </span>

              {pEval.kf != null && (
                <span className="inline-flex items-center rounded-md bg-cyan-100 px-2.5 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                  Factor K final: {pEval.kf.toFixed(5)}
                </span>
              )}
            </div>

            {pEval.venc && (
              <p className={pEval.vencido ? "text-rose-600 font-bold" : "text-slate-500"}>
                Patrón: {pEval.vencido ? `VENCIDO (${pEval.venc})` : `vigente hasta ${pEval.venc}`}
              </p>
            )}
          </div>
        );
      }

      case 'g': {
        const badMeas: string[] = [];
        const pressAlerts: string[] = [];
        se.forEach(([key, gasId, type]) => {
          if (ce(v, key).st === "bad") {
            const gasName = B.find(b => b[0] === gasId)![1];
            badMeas.push(`${gasName} ${type}`);
          }
        });
        B.forEach(([gasId, name]) => {
          const st = le(v, gasId);
          if (st === "bad" || st === "warn") {
            pressAlerts.push(`${name} (${(Xt as any)[st]})`);
          }
        });

        return (
          <div className="space-y-2 text-xs">
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${
                  badMeas.length === 0
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                }`}
              >
                {badMeas.length === 0 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertOctagon className="h-3.5 w-3.5" />}
                {badMeas.length} medición(es) fuera de ± {v.g_tol || "4"} %
              </span>
            </div>

            {badMeas.length > 0 && (
              <ul className="text-rose-700 dark:text-rose-300 list-disc list-inside">
                {badMeas.map((m, idx) => (
                  <li key={idx}>Error fuera de rango: {m}</li>
                ))}
              </ul>
            )}

            {pressAlerts.length > 0 && (
              <p className="text-amber-700 dark:text-amber-300">
                Presión de cilindros: {pressAlerts.join(", ")}
              </p>
            )}
          </div>
        );
      }

      case 'e': {
        const eEval = Oe(v);
        const labels = [
          "Resistencia al min.",
          "Factor de absorción (FA)",
          "Índice de polarización (IP)",
          "Descarga dieléctrica (DD)"
        ];

        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {labels.map((lbl, idx) => {
              const resVal = eEval.v[idx];
              const verdict = eEval.d[idx];
              const isGood = verdict?.[1] === "good";
              const isBad = verdict?.[1] === "bad";

              return (
                <div
                  key={idx}
                  className={`rounded-lg p-2.5 border ${
                    isGood
                      ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                      : isBad
                      ? "border-rose-200 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20"
                      : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
                  }`}
                >
                  <span className="block text-[10px] text-slate-500 truncate">{lbl}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {g(resVal, 2) || "—"}
                  </span>
                  {verdict && (
                    <span
                      className={`block text-[10px] font-semibold ${
                        isGood ? "text-emerald-700" : isBad ? "text-rose-700" : "text-amber-700"
                      }`}
                    >
                      {verdict[0]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      case 'f': {
        const fEval = Pe(v);
        return (
          <div className="space-y-1 text-xs">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-medium dark:bg-slate-800">
                Span inicial: <b>{fEval.ei != null ? `${g(fEval.ei, 4)} %` : "—"}</b>
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-medium dark:bg-slate-800">
                Span final: <b>{fEval.ef != null ? `${g(fEval.ef, 4)} %` : "—"}</b>
              </span>
              {fEval.stp && (
                <span
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 font-bold ${
                    fEval.stp === "good" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}
                >
                  Carga % final: {fEval.stp === "good" ? "En tolerancia" : "Fuera de tolerancia"}
                </span>
              )}
            </div>
          </div>
        );
      }

      case 'a': {
        const astSummary = Ja(v);
        const signedWorkers = [
          ...Array.from({ length: 10 }, (_, i) => "a_es" + i),
          "a_rs",
          "a_as"
        ].filter(k => v[k]).length;

        return (
          <div className="space-y-2 text-xs">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Pasos definidos: <b>{astSummary.steps}</b>
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-bold ${
                  astSummary.mx >= 10
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                }`}
              >
                Riesgo máximo inicial: {astSummary.mx || "—"}
              </span>
              <span className="inline-flex items-center rounded-md bg-cyan-100 px-2.5 py-1 font-semibold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                Firmas registradas: {signedWorkers}
              </span>
            </div>

            {astSummary.bad > 0 && (
              <p className="text-rose-600 font-bold">
                ¡{astSummary.bad} paso(s) con nivel de riesgo 10 o mayor: es obligatorio aplicar controles adicionales antes de iniciar!
              </p>
            )}
          </div>
        );
      }

      case 'h':
      case 'i': {
        const stepItems = Ie(v, currentTab);
        const counts = Ge(stepItems);
        const gasRes = ke(v, currentTab);

        return (
          <div className="space-y-2 text-xs">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                <CheckCircle2 className="h-3 w-3" /> {counts.good} Pasos OK
              </span>
              {counts.bad > 0 && (
                <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 font-bold text-rose-800">
                  <AlertOctagon className="h-3 w-3" /> {counts.bad} A revisar
                </span>
              )}
              <span className="inline-flex items-center rounded bg-cyan-100 px-2 py-0.5 font-bold text-cyan-800">
                Verificación mensual: {gasRes.real ? "REALIZADA" : "NO REALIZADA"}
              </span>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 mb-6">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Resumen en Tiempo Real
        </h3>
        <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Camera className="h-3.5 w-3.5" /> {photos.length} fotos adjuntas
        </span>
      </div>

      {renderSummaryContent()}
    </div>
  );
};
