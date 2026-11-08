import { Ne, ye } from '../constants/data';
import { PhotoItem, StorageEstimate } from '../types';

const DB_NAME = "rp-store";
const STORE_NAME = "blobs";
const DRAFT_KEY = "rp.draft";
const OLD_DRAFT_KEY = "bor";

let dbPromise: Promise<IDBDatabase> | null = null;

export const getIDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      return reject(new Error("IndexedDB no disponible"));
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
};

const withStore = <T = any>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T> =>
  getIDB().then(
    db =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        const req = callback(store);
        tx.oncomplete = () => resolve(req ? req.result : (undefined as unknown as T));
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      })
  );

export const putBlob = (key: string, blob: Blob): Promise<IDBValidKey> =>
  withStore("readwrite", store => store.put(blob, key));

export const getBlob = (key: string): Promise<Blob | undefined> =>
  withStore<Blob | undefined>("readonly", store => store.get(key));

export const deleteBlob = (key: string): Promise<undefined> =>
  withStore<undefined>("readwrite", store => store.delete(key));

export const clearAllBlobs = (): Promise<undefined> =>
  withStore<undefined>("readwrite", store => store.clear());

// In-memory cache for ObjectURLs
export const urlCache = new Map<string, { blob: Blob; url: string }>();

export const getBlobUrl = (key: string): string | undefined => urlCache.get(key)?.url;

export const setCachedBlob = async (key: string, blob: Blob) => {
  const old = urlCache.get(key);
  if (old) URL.revokeObjectURL(old.url);
  urlCache.set(key, { blob, url: URL.createObjectURL(blob) });
  try {
    await putBlob(key, blob);
  } catch (err) {
    console.warn("Could not save blob to IndexedDB:", err);
  }
};

export const removeCachedBlob = async (key: string) => {
  const old = urlCache.get(key);
  if (old) {
    URL.revokeObjectURL(old.url);
    urlCache.delete(key);
  }
  try {
    await deleteBlob(key);
  } catch (err) {
    console.warn("Could not delete blob from IndexedDB:", err);
  }
};

export const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = /data:([^;]+)/.exec(header);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new Blob([array], { type: mime });
};

export async function compressImage(
  file: File | Blob,
  maxDimension = 800,
  quality = 0.6
): Promise<{ blob: Blob; w: number; h: number }> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      b => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
      "image/jpeg",
      quality
    );
  });

  return { blob, w: canvas.width, h: canvas.height };
}

export function applyDefaults(v: Record<string, any>) {
  Object.entries(Ne).forEach(([k, val]) => {
    if (v[k] == null) v[k] = val;
  });
  if (!v.fecha) {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    v.fecha = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
}

export function saveDraft(v: Record<string, any>, photos: PhotoItem[]): boolean {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        schema: 2,
        V: v,
        photos: photos.map(p => ({ id: p.id, c: p.c, w: p.w, h: p.h })),
        ts: Date.now()
      })
    );
    return true;
  } catch {
    return false;
  }
}

export async function loadDraft(): Promise<{
  v: Record<string, any>;
  photos: PhotoItem[];
} | null> {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(DRAFT_KEY) || localStorage.getItem(OLD_DRAFT_KEY);
  } catch {}

  if (!raw) {
    const freshV: Record<string, any> = {};
    applyDefaults(freshV);
    return { v: freshV, photos: [] };
  }

  try {
    const parsed = JSON.parse(raw);
    const v = parsed.V || {};
    applyDefaults(v);

    const photos: PhotoItem[] = [];
    if (Array.isArray(parsed.photos)) {
      for (const item of parsed.photos) {
        let blob: Blob | undefined;
        if (item.dataURL) {
          blob = dataUrlToBlob(item.dataURL);
        } else {
          try {
            blob = await getBlob("photo:" + item.id);
          } catch {}
        }
        if (blob) {
          await setCachedBlob("photo:" + item.id, blob);
          photos.push({
            id: item.id,
            c: item.c || "",
            w: item.w,
            h: item.h,
            url: getBlobUrl("photo:" + item.id)
          });
        }
      }
    }

    // Load signatures
    for (const key of ye) {
      if (v[key] && !urlCache.has("sig:" + key)) {
        try {
          const sigBlob = await getBlob("sig:" + key);
          if (sigBlob) {
            await setCachedBlob("sig:" + key, sigBlob);
          } else {
            delete v[key];
          }
        } catch {
          delete v[key];
        }
      }
    }

    return { v, photos };
  } catch (e) {
    console.error("Failed to load draft:", e);
    const freshV: Record<string, any> = {};
    applyDefaults(freshV);
    return { v: freshV, photos: [] };
  }
}

export async function clearDraft(keepInspector?: string, keepForm?: string) {
  try {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(OLD_DRAFT_KEY);
  } catch {}

  for (const key of Array.from(urlCache.keys())) {
    await removeCachedBlob(key);
  }
  try {
    await clearAllBlobs();
  } catch {}

  const freshV: Record<string, any> = {};
  if (keepInspector) freshV.insp = keepInspector;
  if (keepForm) freshV.fm = keepForm;
  applyDefaults(freshV);
  return freshV;
}

export async function exportDraftJson(
  v: Record<string, any>,
  photos: PhotoItem[]
): Promise<Blob> {
  const exportPhotos = [];
  for (const p of photos) {
    const cached = urlCache.get("photo:" + p.id);
    exportPhotos.push({
      ...p,
      dataURL: cached ? await blobToDataUrl(cached.blob) : null
    });
  }

  const sigs: Record<string, string> = {};
  for (const k of ye) {
    if (v[k] && urlCache.has("sig:" + k)) {
      sigs[k] = await blobToDataUrl(urlCache.get("sig:" + k)!.blob);
    }
  }

  const payload = {
    schema: 2,
    app: "Reportes Prev - Holcim",
    exported: new Date().toISOString(),
    V: v,
    photos: exportPhotos,
    sigs
  };

  return new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
}

export async function importDraftJson(
  jsonText: string
): Promise<{ v: Record<string, any>; photos: PhotoItem[] }> {
  const data = JSON.parse(jsonText);
  if (!data || typeof data !== "object" || !data.V) {
    throw new Error("El archivo no es un respaldo válido de Reportes Prev");
  }

  const v = { ...data.V };
  applyDefaults(v);

  // Restore signatures
  if (data.sigs) {
    for (const [k, dUrl] of Object.entries(data.sigs)) {
      if (typeof dUrl === "string") {
        const blob = dataUrlToBlob(dUrl);
        await setCachedBlob("sig:" + k, blob);
        v[k] = "1";
      }
    }
  }

  // Restore photos
  const photos: PhotoItem[] = [];
  if (Array.isArray(data.photos)) {
    for (const p of data.photos) {
      if (p.dataURL) {
        const blob = dataUrlToBlob(p.dataURL);
        await setCachedBlob("photo:" + p.id, blob);
        photos.push({
          id: p.id,
          c: p.c || "",
          w: p.w,
          h: p.h,
          url: getBlobUrl("photo:" + p.id)
        });
      }
    }
  }

  saveDraft(v, photos);
  return { v, photos };
}

export async function getStorageEstimate(): Promise<StorageEstimate | null> {
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      return {
        usage: est.usage || 0,
        quota: est.quota || 0,
        ratio: est.quota ? (est.usage || 0) / est.quota : 0
      };
    }
    return null;
  } catch {
    return null;
  }
}
