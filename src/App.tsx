import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { SummaryCard } from './components/SummaryCard';
import { PhotoManager } from './components/PhotoManager';
import { CemsForm } from './components/Forms/CemsForm';
import { PesadorasForm } from './components/Forms/PesadorasForm';
import { GasesForm } from './components/Forms/GasesForm';
import { MotoresForm } from './components/Forms/MotoresForm';
import { PfisterForm } from './components/Forms/PfisterForm';
import { AstForm } from './components/Forms/AstForm';
import { PrecalentadorForm } from './components/Forms/PrecalentadorForm';
import { ReportType, PhotoItem } from './types';
import {
  loadDraft,
  saveDraft,
  clearDraft,
  exportDraftJson,
  importDraftJson,
  applyDefaults
} from './utils/storage';
import { preparePdfAssets, generateReportPdf } from './utils/pdfGenerator';
import { getDemoData } from './utils/demoData';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [v, setV] = useState<Record<string, any>>(() => {
    const fresh: Record<string, any> = { fm: 'c' };
    applyDefaults(fresh);
    return fresh;
  });
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [currentTab, setCurrentTab] = useState<ReportType>('c');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4500);
  };

  // Load draft on mount
  useEffect(() => {
    loadDraft().then(loaded => {
      if (loaded) {
        setV(loaded.v);
        setPhotos(loaded.photos);
        if (loaded.v.fm) {
          setCurrentTab(loaded.v.fm as ReportType);
        }
      }
    });
  }, []);

  // Debounced auto-save
  const triggerAutoSave = useCallback((newV: Record<string, any>, newPhotos: PhotoItem[]) => {
    setSaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      const ok = saveDraft(newV, newPhotos);
      setSaveStatus(ok ? 'saved' : 'error');
    }, 500);
  }, []);

  const handleChange = (key: string, value: any) => {
    setV(prev => {
      const updated = { ...prev, [key]: value };
      triggerAutoSave(updated, photos);
      return updated;
    });
  };

  const handleBatchUpdate = (updates: Record<string, any>) => {
    setV(prev => {
      const updated = { ...prev, ...updates };
      triggerAutoSave(updated, photos);
      return updated;
    });
  };

  const handlePhotosChange = (newPhotos: PhotoItem[]) => {
    setPhotos(newPhotos);
    triggerAutoSave(v, newPhotos);
  };

  const handleTabChange = (tab: ReportType) => {
    setCurrentTab(tab);
    handleChange('fm', tab);
  };

  const handleNewReport = async () => {
    const keepInspector = v.insp;
    const keepForm = currentTab;
    const freshV = await clearDraft(keepInspector, keepForm);
    setV(freshV);
    setPhotos([]);
    showToast('Borrador restablecido. Reporte nuevo listo.', 'success');
  };

  const handleExport = async () => {
    try {
      const blob = await exportDraftJson(v, photos);
      const filename = `Respaldo_Reportes_Prev_${v.fecha || 'sin_fecha'}.json`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      showToast('Respaldo exportado exitosamente.', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error al exportar respaldo.', 'error');
    }
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const loaded = await importDraftJson(text);
      setV(loaded.v);
      setPhotos(loaded.photos);
      if (loaded.v.fm) {
        setCurrentTab(loaded.v.fm as ReportType);
      }
      showToast('Respaldo importado y restaurado con éxito.', 'success');
    } catch (e: any) {
      console.error(e);
      showToast('No se pudo importar: ' + e.message, 'error');
    }
  };

  const handleLoadDemo = () => {
    const demo = getDemoData(currentTab);
    handleBatchUpdate(demo);
    showToast(`Datos de ejemplo cargados para ${currentTab.toUpperCase()}.`, 'info');
  };

  const handleGeneratePdf = async () => {
    if (currentTab !== 'a' && !(v.insp || '').trim()) {
      showToast('Por favor escribe el nombre del inspector antes de generar el PDF.', 'error');
      return;
    }

    setIsGeneratingPdf(true);
    try {
      const assets = await preparePdfAssets(v, photos);
      const pdfBlob = generateReportPdf(v, assets);

      // Determine clean filename
      const cleanHac = (text: string) => String(text || '').trim().replace(/[\\/:*?"<>|]/g, '-');
      const dateStr = v.fecha || 'sin_fecha';
      let filename = `Reporte_${dateStr}.pdf`;

      switch (currentTab) {
        case 'a':
          filename = `AST ${dateStr}.pdf`;
          break;
        case 'e':
          filename = `${cleanHac(v.e_hac) || 'Motor'} ${dateStr}.pdf`;
          break;
        case 'p':
          filename = `${cleanHac(v.p_hac) || 'Pesadora'} ${dateStr}.pdf`;
          break;
        case 'f':
          filename = `${cleanHac(v.f_hac) || 'Pfister'} ${dateStr}.pdf`;
          break;
        case 'h':
        case 'i':
          filename = `${cleanHac(v[currentTab + '_eq']) || 'Precalentador'} ${dateStr}.pdf`;
          break;
        case 'g':
          filename = `TC421-2K1 Verificación con gases patrón ${dateStr}.pdf`;
          break;
        default:
          filename = `TC.421-2K1 Inspección Semanal ${dateStr}.pdf`;
      }

      // Try Web Share API (mobile devices)
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: filename,
            text: `Reporte de Mantenimiento Preventivo - Holcim Planta Tecomán`
          });
          showToast('PDF compartido correctamente.', 'success');
          setIsGeneratingPdf(false);
          return;
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') {
            setIsGeneratingPdf(false);
            return;
          }
        }
      }

      // Download directly
      const fileUrl = URL.createObjectURL(pdfBlob);
      const dlLink = document.createElement('a');
      dlLink.href = fileUrl;
      dlLink.download = filename;
      dlLink.click();
      setTimeout(() => URL.revokeObjectURL(fileUrl), 4000);

      showToast(`PDF generado y descargado: ${filename}`, 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('No se pudo generar el PDF. Verifica los datos.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-800 dark:bg-slate-950 dark:text-slate-100 antialiased p-3 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold shadow-lg border backdrop-blur-md transition-all ${
              toastMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200'
                : toastMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200'
                : 'bg-cyan-50 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:border-cyan-800 dark:text-cyan-200'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            )}
            {toastMessage.text}
          </div>
        )}

        {/* Header & Tabs */}
        <Header
          currentTab={currentTab}
          onTabChange={handleTabChange}
          v={v}
          onChange={handleChange}
          onNewReport={handleNewReport}
          onExport={handleExport}
          onImport={handleImport}
          onGeneratePdf={handleGeneratePdf}
          onLoadDemo={handleLoadDemo}
          onPrint={handlePrint}
          isGeneratingPdf={isGeneratingPdf}
          saveStatus={saveStatus}
        />

        {/* Live Summary Card */}
        <SummaryCard currentTab={currentTab} v={v} photos={photos} />

        {/* Form Body */}
        <main className="mb-6">
          {currentTab === 'c' && (
            <CemsForm v={v} onChange={handleChange} onBatchUpdate={handleBatchUpdate} />
          )}
          {currentTab === 'p' && (
            <PesadorasForm v={v} onChange={handleChange} />
          )}
          {currentTab === 'g' && (
            <GasesForm v={v} onChange={handleChange} />
          )}
          {currentTab === 'e' && (
            <MotoresForm v={v} onChange={handleChange} />
          )}
          {currentTab === 'f' && (
            <PfisterForm v={v} onChange={handleChange} />
          )}
          {currentTab === 'a' && (
            <AstForm v={v} onChange={handleChange} />
          )}
          {currentTab === 'h' && (
            <PrecalentadorForm
              eqKey="h"
              v={v}
              onChange={handleChange}
              onBatchUpdate={handleBatchUpdate}
            />
          )}
          {currentTab === 'i' && (
            <PrecalentadorForm
              eqKey="i"
              v={v}
              onChange={handleChange}
              onBatchUpdate={handleBatchUpdate}
            />
          )}
        </main>

        {/* Evidencia Fotográfica */}
        <div className="mb-8">
          <PhotoManager photos={photos} onChange={handlePhotosChange} />
        </div>

        {/* Bottom Floating or Sticky Action on Mobile */}
        <div className="sticky bottom-4 z-40 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white">
              {currentTab === 'a' ? 'AST de Seguridad' : v.insp || 'Inspector no especificado'}
            </span>
            <span className="block text-[11px] text-slate-500">
              {v.fecha || 'Sin fecha'} · {photos.length} fotos
            </span>
          </div>

          <button
            type="button"
            onClick={handleGeneratePdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-cyan-800 disabled:opacity-50 transition-all"
          >
            {isGeneratingPdf ? 'Generando...' : 'Generar PDF Oficial'}
          </button>
        </div>

        {/* Footer info */}
        <footer className="text-center text-[11px] text-slate-400 dark:text-slate-500 pb-8">
          Holcim México · Planta Tecomán · Sistema de Reportes Preventivos CEM's, Básculas, Motores y AST
        </footer>
      </div>
    </div>
  );
}
