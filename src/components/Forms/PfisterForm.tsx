import React from 'react';
import { Sliders, HelpCircle, CheckCircle2, AlertOctagon, AlertTriangle } from 'lucide-react';
import { O } from '../../constants/data';
import { Pe, g } from '../../utils/calc';

interface PfisterFormProps {
  v: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const PfisterForm: React.FC<PfisterFormProps> = ({ v, onChange }) => {
  const res = Pe(v);

  return (
    <div className="space-y-6">
      {/* Equipo */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sliders className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Datos del Dosificador Pfister
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Código HAC
            </label>
            <input
              type="text"
              value={v.f_hac || ""}
              onChange={e => onChange("f_hac", e.target.value)}
              placeholder="ej. 531-DO1"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              Modelo Pfister
            </label>
            <input
              type="text"
              value={v.f_mod || ""}
              onChange={e => onChange("f_mod", e.target.value)}
              placeholder="ej. AX123"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* 1. Compensación carga muerta */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            1. Compensación Carga Muerta
          </h3>
          <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full">
            Ideal: 0.0 kg/U · 0.00 %
          </span>
        </div>

        <details className="mb-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/40 dark:text-slate-400">
          <summary className="cursor-pointer font-semibold flex items-center gap-1.5 text-cyan-800 dark:text-cyan-300">
            <HelpCircle className="h-3.5 w-3.5" /> Ver procedimiento
          </summary>
          <p className="mt-2 whitespace-pre-line leading-relaxed">{O.muerta}</p>
        </details>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/20">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Antes del ajuste
            </span>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-500">Carga inicial kg/U (0.00)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v.f_z1 || ""}
                  onChange={e => onChange("f_z1", e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Carga inicial % (0.0)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v.f_z2 || ""}
                  onChange={e => onChange("f_z2", e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/20">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Después del ajuste
            </span>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-500">Carga final kg/U (0.00)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v.f_z3 || ""}
                  onChange={e => onChange("f_z3", e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Carga final % (0.0)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v.f_z4 || ""}
                  onChange={e => onChange("f_z4", e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Span Pfister */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
          2. Span Pfister
        </h3>

        <details className="mb-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/40 dark:text-slate-400">
          <summary className="cursor-pointer font-semibold flex items-center gap-1.5 text-cyan-800 dark:text-cyan-300">
            <HelpCircle className="h-3.5 w-3.5" /> Ver procedimiento
          </summary>
          <p className="mt-2 whitespace-pre-line leading-relaxed">{O.span}</p>
        </details>

        <div className="mb-4">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            Valor nominal de calibración kg/U
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={v.f_nom || ""}
            onChange={e => onChange("f_nom", e.target.value)}
            placeholder="ej. 208.17"
            className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/20">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Antes del ajuste
            </span>
            <div>
              <label className="text-[10px] text-slate-500">Carga inicial kg/U</label>
              <input
                type="text"
                inputMode="decimal"
                value={v.f_si || ""}
                onChange={e => onChange("f_si", e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Error inicial:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-300">
                {res.ei != null ? `${g(res.ei, 4)} %` : "—"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/20">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Después del ajuste (repetibilidad ± 0.5 kg/U)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500">Carga 1</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v.f_s1 || ""}
                  onChange={e => onChange("f_s1", e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs text-center dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Carga 2</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v.f_s2 || ""}
                  onChange={e => onChange("f_s2", e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs text-center dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Carga 3</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v.f_s3 || ""}
                  onChange={e => onChange("f_s3", e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs text-center dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Error promedio final:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-300">
                {res.ef != null ? `${g(res.ef, 4)} %` : "—"}
              </span>
            </div>

            {res.repS != null && (
              <p className="mt-1 text-[11px] text-slate-500">
                Repetibilidad: <b>{g(res.repS, 3)} kg/U</b> (máx. ± 0.5 kg/U)
              </p>
            )}
          </div>
        </div>

        {/* Sin pesas */}
        <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/30 dark:border-slate-800 dark:bg-slate-800/10">
          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Retiro de pesas (retorno a cero)
          </span>
          <p className="text-[11px] text-slate-500 mb-2">{O.retire}</p>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <div>
              <label className="text-[10px] text-slate-500">Carga kg/U</label>
              <input
                type="text"
                inputMode="decimal"
                value={v.f_rk || "0"}
                onChange={e => onChange("f_rk", e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500">Carga %</label>
              <input
                type="text"
                inputMode="decimal"
                value={v.f_rp || "0"}
                onChange={e => onChange("f_rp", e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Calibración Dinámica y Rotación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
            3. Calibración Dinámica
          </h3>
          <p className="text-xs text-slate-500 mb-3">{O.dinamica}</p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Carga inicial kg/U (Menor / Mayor)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Menor"
                  value={v.f_mink || ""}
                  onChange={e => onChange("f_mink", e.target.value)}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Mayor"
                  value={v.f_maxk || ""}
                  onChange={e => onChange("f_maxk", e.target.value)}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Carga inicial % (Menor / Mayor)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Menor"
                  value={v.f_minp || ""}
                  onChange={e => onChange("f_minp", e.target.value)}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Mayor"
                  value={v.f_maxp || ""}
                  onChange={e => onChange("f_maxp", e.target.value)}
                  className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
            4. Constante de Rotación
          </h3>
          <p className="text-xs text-slate-500 mb-3">Rotación constante en menú del sistema</p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Inicial</label>
              <input
                type="text"
                inputMode="decimal"
                value={v.f_ri || ""}
                onChange={e => onChange("f_ri", e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Final</label>
              <input
                type="text"
                inputMode="decimal"
                value={v.f_rf || ""}
                onChange={e => onChange("f_rf", e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Ajuste de curva zero y valores finales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
            5. Ajuste de Curva Zero
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            El valor no debe exceder 10 %; repetibilidad ± 0.2 %
          </p>

          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            {[1, 2, 3].map(idx => (
              <div key={idx}>
                <label className="text-[10px] text-slate-500">Valor Cero {idx} %</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v["f_c" + idx] || ""}
                  onChange={e => onChange("f_c" + idx, e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-center text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            ))}
          </div>

          {res.repC != null && (
            <p className="text-[11px] text-slate-500">
              Diferencia: <b>{g(res.repC, 3)} %</b> (máx. ± 0.2 %)
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
            6. Valores Finales (Operando)
          </h3>
          <p className="text-xs text-slate-500 mb-3">{O.final}</p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Error aceptable (± %)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={v.f_tol || "0.1"}
                onChange={e => onChange("f_tol", e.target.value)}
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500">Carga kg/U (0.00)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v.f_fk || "0"}
                  onChange={e => onChange("f_fk", e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Carga % (0.0)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v.f_fp || "0"}
                  onChange={e => onChange("f_fp", e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            {res.stp && (
              <div className="flex items-center gap-2 pt-1">
                {res.stp === "good" ? (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> Carga % en tolerancia
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                    <AlertOctagon className="h-3 w-3" /> Fuera de tolerancia
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
