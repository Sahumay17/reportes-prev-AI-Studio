import React from 'react';
import { Activity, Zap, CheckCircle2, AlertOctagon, AlertTriangle } from 'lucide-react';
import { ka, La, q, ge } from '../../constants/data';
import { Oe, Be, g } from '../../utils/calc';

interface MotoresFormProps {
  v: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const MotoresForm: React.FC<MotoresFormProps> = ({ v, onChange }) => {
  const evalRes = Oe(v);
  const chartCmds = Be(evalRes);

  return (
    <div className="space-y-6">
      {/* Datos del motor */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Zap className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Datos de Placa del Motor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {ka.map(([key, label]) => (
            <div key={key}>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                {label}
              </label>
              <input
                type="text"
                value={v[key] || ""}
                onChange={e => onChange(key, e.target.value)}
                placeholder="—"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Condiciones de la prueba */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100">
          Condiciones de la Prueba
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Temperatura de prueba (°C)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={v.e_temp || ""}
              onChange={e => onChange("e_temp", e.target.value)}
              placeholder="ej. 32"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Voltaje de prueba (VCD)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={v.e_vtest || "500"}
              onChange={e => onChange("e_vtest", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-3 dark:border-cyan-900/40 dark:bg-cyan-950/20 flex flex-col justify-center">
            <span className="text-[11px] text-cyan-800 dark:text-cyan-300 font-medium">
              Factor Kt (corrección a 40 °C)
            </span>
            <span className="text-lg font-bold text-cyan-900 dark:text-cyan-200">
              {evalRes.kt == null ? "—" : evalRes.kt.toFixed(4)}
            </span>
            <span className="text-[10px] text-slate-500">Kt = 0.5 ^ ((40 - T) / 10)</span>
          </div>
        </div>
      </div>

      {/* Lecturas de aislamiento */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Lecturas de Resistencia de Aislamiento (GOhms)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          {q.map((timeMin, idx) => {
            const isHighlight = timeMin === 1 || timeMin === 10;
            return (
              <div
                key={idx}
                className={`rounded-xl border p-2.5 transition-all ${
                  isHighlight
                    ? "border-cyan-300 bg-cyan-50/50 dark:border-cyan-800 dark:bg-cyan-950/30"
                    : "border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-bold ${isHighlight ? "text-cyan-800 dark:text-cyan-300" : "text-slate-600 dark:text-slate-400"}`}>
                    {ge[idx]}
                  </span>
                  {isHighlight && (
                    <span className="text-[9px] font-extrabold uppercase text-cyan-700 bg-cyan-100 dark:bg-cyan-900/60 dark:text-cyan-200 px-1 rounded">
                      {timeMin === 1 ? "1 min" : "10 min"}
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Medida"
                  value={v["e_r_" + idx] || ""}
                  onChange={e => onChange("e_r_" + idx, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-center font-bold text-slate-800 focus:border-cyan-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />

                <div className="mt-1 text-center text-[10px] text-slate-500 dark:text-slate-400">
                  Correg.: <b>{g(evalRes.c[idx], 3) || "—"}</b>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gráfica SVG */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-2 text-base font-bold text-slate-800 dark:text-slate-100">
          Gráfica de Resistencia de Aislamiento vs Tiempo
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Curvas medida (línea gris punteada) y corregida a 40 °C (línea azul continua)
        </p>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2 dark:border-slate-800 dark:bg-slate-950/40">
          <svg viewBox="0 0 640 300" className="w-full h-auto">
            {chartCmds.map((cmd, idx) => {
              const strokeColor =
                cmd.c === "grid"
                  ? "#e2e8f0"
                  : cmd.c === "axis"
                  ? "#64748b"
                  : cmd.c === "s1"
                  ? "#94a3b8"
                  : cmd.c === "s2"
                  ? "#0284c7"
                  : cmd.c === "hl"
                  ? "#f43f5e"
                  : "#0f172a";

              const fillColor =
                cmd.c === "s1"
                  ? "#94a3b8"
                  : cmd.c === "s2"
                  ? "#0284c7"
                  : cmd.c === "mu"
                  ? "#64748b"
                  : "#0f172a";

              if (cmd.k === "l") {
                return (
                  <line
                    key={idx}
                    x1={cmd.x1}
                    y1={cmd.y1}
                    x2={cmd.x2}
                    y2={cmd.y2}
                    stroke={strokeColor}
                    strokeWidth={cmd.w || 1}
                    strokeDasharray={cmd.d}
                  />
                );
              }
              if (cmd.k === "c") {
                return (
                  <circle
                    key={idx}
                    cx={cmd.x}
                    cy={cmd.y}
                    r={cmd.r || 3}
                    fill={fillColor}
                  />
                );
              }
              if (cmd.k === "t") {
                return (
                  <text
                    key={idx}
                    x={cmd.x}
                    y={cmd.y}
                    fontSize={cmd.s || 14}
                    fill={fillColor}
                    fontWeight={cmd.b ? "bold" : "normal"}
                    textAnchor={cmd.a === "c" ? "middle" : cmd.a === "r" ? "end" : "start"}
                    fontFamily="system-ui, sans-serif"
                  >
                    {cmd.t}
                  </text>
                );
              }
              return null;
            })}
          </svg>
        </div>
      </div>

      {/* Resultados IEEE 43-2000 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100">
          Resultados y Dictamen (IEEE 43-2000)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {La.map((testTitle, idx) => {
            const verdict = evalRes.d[idx];
            const resultVal = evalRes.v[idx];
            const isGood = verdict?.[1] === "good";
            const isWarn = verdict?.[1] === "warn";
            const isBad = verdict?.[1] === "bad";

            return (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition-all ${
                  isBad
                    ? "border-rose-300 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20"
                    : isWarn
                    ? "border-amber-300 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/20"
                    : isGood
                    ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                    : "border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {testTitle}
                  </h4>
                  {verdict && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        isGood
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : isWarn
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {isGood && <CheckCircle2 className="h-3 w-3" />}
                      {isWarn && <AlertTriangle className="h-3 w-3" />}
                      {isBad && <AlertOctagon className="h-3 w-3" />}
                      {verdict[0]}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xs text-slate-500">Resultado:</span>
                  <span className="text-lg font-black text-cyan-800 dark:text-cyan-300">
                    {idx === 3 ? (
                      <input
                        type="text"
                        inputMode="decimal"
                        value={v.e_dd || "0"}
                        onChange={e => onChange("e_dd", e.target.value)}
                        className="w-20 rounded border border-slate-300 px-2 py-0.5 text-center text-sm font-bold dark:border-slate-700 dark:bg-slate-800"
                      />
                    ) : (
                      g(resultVal, 2) || "—"
                    )}
                  </span>
                  <span className="text-xs text-slate-500">
                    {idx === 0 ? "GOhms" : idx === 1 ? "FA" : idx === 2 ? "IP" : "DD"}
                  </span>
                </div>

                {idx === 0 && (
                  <div className="mb-2">
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Resistencia mínima (MOhms)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={v.e_min || "100"}
                      onChange={e => onChange("e_min", e.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    placeholder="Observaciones de esta prueba..."
                    value={v["e_o" + idx] || ""}
                    onChange={e => onChange("e_o" + idx, e.target.value)}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Datos adicionales de la prueba */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100">
          Datos Adicionales de la Prueba Eléctrica
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs mb-4">
          {[
            ["e_l12", "Resistencia L1-L2 (mΩ)"],
            ["e_l13", "Resistencia L1-L3 (mΩ)"],
            ["e_l23", "Resistencia L2-L3 (mΩ)"],
            ["e_na", "Corriente de fuga (nA)"],
            ["e_nf", "Capacitancia (nF)"]
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                {label}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={v[key] || ""}
                onChange={e => onChange(key, e.target.value)}
                placeholder="—"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            Nota general
          </label>
          <textarea
            rows={2}
            value={v.e_nota || ""}
            onChange={e => onChange("e_nota", e.target.value)}
            placeholder="Comentarios o recomendaciones sobre el estado del aislamiento..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
};
