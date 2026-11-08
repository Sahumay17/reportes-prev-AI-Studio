import React, { useRef, useState } from 'react';
import {
  FileText, PlusCircle, Download, Upload, Printer, Sparkles, AlertCircle, CheckCircle2
} from 'lucide-react';
import { ne } from '../constants/data';
import { ReportType } from '../types';

interface HeaderProps {
  currentTab: ReportType;
  onTabChange: (tab: ReportType) => void;
  v: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onNewReport: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onGeneratePdf: () => void;
  onLoadDemo: () => void;
  onPrint: () => void;
  isGeneratingPdf: boolean;
  saveStatus: 'saved' | 'saving' | 'error';
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  v,
  onChange,
  onNewReport,
  onExport,
  onImport,
  onGeneratePdf,
  onLoadDemo,
  onPrint,
  isGeneratingPdf,
  saveStatus
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [confirmNew, setConfirmNew] = useState(false);

  const activeTabMeta = ne.find(t => t.id === currentTab) || ne[0];

  const handleNewClick = () => {
    if (!confirmNew) {
      setConfirmNew(true);
      setTimeout(() => setConfirmNew(false), 5000);
    } else {
      setConfirmNew(false);
      onNewReport();
    }
  };

  return (
    <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-6">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
            Holcim · Mantenimiento Preventivo
          </span>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            {activeTabMeta.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeTabMeta.sub}
          </p>
        </div>

        {/* Global Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onGeneratePdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-cyan-800 disabled:opacity-50 transition-all active:scale-95"
          >
            <FileText className="h-4 w-4" />
            {isGeneratingPdf ? "Generando PDF..." : "Generar y guardar PDF"}
          </button>

          <button
            type="button"
            onClick={onLoadDemo}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300 transition-colors"
            title="Cargar valores de prueba para este reporte"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ejemplo
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            title="Imprimir o guardar directamente desde navegador"
          >
            <Printer className="h-3.5 w-3.5" />
            Imprimir
          </button>

          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            title="Exportar respaldo de datos y fotos a archivo .json"
          >
            <Download className="h-3.5 w-3.5" />
            Respaldo
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            title="Restaurar datos desde archivo .json"
          >
            <Upload className="h-3.5 w-3.5" />
            Importar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={e => {
              if (e.target.files?.[0]) {
                onImport(e.target.files[0]);
                e.target.value = "";
              }
            }}
          />

          <button
            type="button"
            onClick={handleNewClick}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              confirmNew
                ? "border-rose-400 bg-rose-600 text-white font-bold animate-pulse"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            {confirmNew ? "¿Confirmar borrado?" : "Nuevo reporte"}
          </button>
        </div>
      </div>

      {/* Date, Inspector, and Save Indicator row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-3 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Fecha de inspección
          </label>
          <input
            type="date"
            value={v.fecha || ""}
            onChange={e => onChange("fecha", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {currentTab !== "a" && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Nombre del inspector
            </label>
            <input
              type="text"
              value={v.insp || ""}
              onChange={e => onChange("insp", e.target.value)}
              placeholder="Ingeniero / Técnico responsable"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        )}

        <div className="flex items-center sm:justify-end gap-2 text-xs text-slate-500 pt-2 sm:pt-4">
          {saveStatus === "saved" && (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Guardado localmente
            </span>
          )}
          {saveStatus === "saving" && (
            <span className="inline-flex items-center gap-1 text-cyan-600 animate-pulse">
              Guardando borrador...
            </span>
          )}
          {saveStatus === "error" && (
            <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
              <AlertCircle className="h-3.5 w-3.5" /> Espacio lleno (exporta respaldo)
            </span>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="pt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {ne.map(tab => {
          const isActive = tab.id === currentTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-cyan-700 text-white shadow-xs scale-102"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.tab}
            </button>
          );
        })}
      </div>
    </header>
  );
};
