import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Trash2, AlertCircle } from 'lucide-react';
import { PhotoItem } from '../types';
import { MAX_PHOTOS } from '../constants/data';
import { compressImage, setCachedBlob, removeCachedBlob, getBlobUrl } from '../utils/storage';

interface PhotoManagerProps {
  photos: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
}

export const PhotoManager: React.FC<PhotoManagerProps> = ({ photos, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    setErrorMsg(null);
    setProcessing(true);

    const updated = [...photos];
    for (let i = 0; i < fileList.length; i++) {
      if (updated.length >= MAX_PHOTOS) {
        setErrorMsg(`Límite alcanzado: máximo ${MAX_PHOTOS} fotos por reporte.`);
        break;
      }
      const file = fileList[i];
      try {
        const { blob, w, h } = await compressImage(file, 800, 0.65);
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        await setCachedBlob('photo:' + id, blob);
        updated.push({
          id,
          c: '',
          w,
          h,
          url: getBlobUrl('photo:' + id)
        });
      } catch (e) {
        console.error('Error compressing image:', e);
        setErrorMsg('No se pudo procesar una de las imágenes seleccionadas.');
      }
    }

    setProcessing(false);
    onChange(updated);
  };

  const handleRemove = async (index: number) => {
    const target = photos[index];
    if (target) {
      await removeCachedBlob('photo:' + target.id);
    }
    const updated = photos.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updated = photos.map((p, idx) => (idx === index ? { ...p, c: caption } : p));
    onChange(updated);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
            <Camera className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            Evidencia Fotográfica
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {photos.length} de {MAX_PHOTOS} fotos agregadas (se optimizan automáticamente a 800 px)
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={photos.length >= MAX_PHOTOS || processing}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-cyan-800 disabled:opacity-40 transition-colors"
        >
          <ImageIcon className="h-4 w-4" />
          {processing ? 'Procesando...' : 'Agregar fotos'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {photos.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-8 text-center hover:border-cyan-500 dark:border-slate-800 dark:hover:border-cyan-500 transition-colors"
        >
          <Camera className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Toca aquí para adjuntar o tomar fotos
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Se incluirán organizadas en las páginas finales del PDF
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60"
            >
              <div className="relative aspect-4/3 w-full bg-slate-200 dark:bg-slate-800">
                <img
                  src={photo.url || getBlobUrl('photo:' + photo.id)}
                  alt={`Foto ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-2 right-2 rounded-md bg-rose-600/90 p-1.5 text-white hover:bg-rose-700 shadow-xs transition-colors"
                  title="Eliminar foto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-2.5">
                <input
                  type="text"
                  placeholder="Descripción de la foto..."
                  value={photo.c}
                  onChange={e => handleCaptionChange(idx, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-cyan-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
