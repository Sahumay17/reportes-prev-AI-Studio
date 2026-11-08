import React, { useRef, useEffect, useState } from 'react';
import { X, RotateCcw, Trash2, Check } from 'lucide-react';

interface SignatureModalProps {
  sigKey: string;
  hasExisting: boolean;
  onClose: () => void;
  onSave: (blob: Blob) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  hasExisting,
  onClose,
  onSave,
  onDelete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
  }, []);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0];
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    setHasDrawn(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const [x, y] = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const [x, y] = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    canvas.toBlob(async blob => {
      if (blob) {
        await onSave(blob);
        onClose();
      }
    }, 'image/png');
  };

  const handleDelete = async () => {
    await onDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Firma digital
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dibuja tu firma con el dedo, stylus o ratón
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white dark:border-slate-700">
          <canvas
            ref={canvasRef}
            className="h-52 w-full touch-none cursor-crosshair bg-white"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
          <div className="pointer-events-none absolute bottom-4 left-6 right-6 border-b border-dashed border-slate-300 text-center text-xs text-slate-400">
            Línea de firma
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearCanvas}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Limpiar
            </button>

            {hasExisting && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Borrar firma
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasDrawn}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-cyan-800 disabled:opacity-40"
            >
              <Check className="h-4 w-4" />
              Guardar firma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
