import { jsPDF } from 'jspdf';
import {
  HOLCIM_LOGO, K, oe, re, Ze, Y, J, B, se, he, Ta, Xe, q, ge, V, ie, O, xe
} from '../constants/data';
import {
  g, Ae, ze, Re, ce, le, ee, Oe, Be, Pe, ve, de, we, Ie, ke, Xt
} from './calc';
import { PhotoItem } from '../types';
import { urlCache, blobToDataUrl } from './storage';

export const m = {
  BL: [0, 176, 240] as [number, number, number],
  GY: [217, 217, 217] as [number, number, number],
  GM: [192, 192, 192] as [number, number, number],
  LG: [242, 242, 242] as [number, number, number],
  TL: [0, 100, 130] as [number, number, number],
  CB: [153, 180, 230] as [number, number, number],
  WH: [255, 255, 255] as [number, number, number],
  RED: [179, 54, 11] as [number, number, number],
  ST: {
    good: [46, 160, 90] as [number, number, number],
    warn: [255, 190, 0] as [number, number, number],
    bad: [220, 40, 40] as [number, number, number]
  },
  RK: {
    G: [146, 208, 80] as [number, number, number],
    Y: [255, 235, 60] as [number, number, number],
    O: [247, 150, 30] as [number, number, number],
    R: [230, 30, 30] as [number, number, number]
  }
};

const Ut = 3.6286;

const Ya: Record<string, [number, number, number]> = {
  grid: [225, 225, 225],
  axis: [70, 70, 70],
  txt: [0, 0, 0],
  mu: [90, 90, 90],
  s1: [120, 120, 120],
  s2: [0, 110, 200],
  hl: [200, 40, 40]
};

export interface PDFHelper {
  D: jsPDF;
  X: number;
  W: number;
  y: number;
  C: typeof m;
  landscape: boolean;
  tx: (text: string | string[], x: number, y: number, opt?: { b?: number | boolean; s?: number; c?: [number, number, number]; a?: "l" | "c" | "r" }) => void;
  bx: (x: number, y: number, w: number, h: number, fill?: [number, number, number]) => void;
  sp: (text: string | number | null | undefined, width: number, size?: number) => string[];
  h: (items: [string | number | null | undefined, number, number?][], opt?: { lh?: number; pad?: number; min?: number }) => number;
  page: () => void;
  pg: (neededHeight: number) => boolean;
  cell: (x: number, y: number, w: number, h: number, text: string | number | null | undefined, opt?: any) => void;
  tr: (colWidths: number[], values: (string | number | null | undefined)[], rowHeight: number, opt?: any) => void;
  bar: (text: string, fill: [number, number, number], opt?: any) => void;
  note: (text: string | null | undefined, opt?: any) => void;
  para: (text: string, opt?: any) => void;
  kv: (key: string, val: any, x: number, y: number) => void;
  lv: (key: string, val: any, x: number, width: number, height?: number) => void;
  cb: (x: number, y: number, checked: boolean) => void;
  img: (dataUri: string | undefined, x: number, y: number, maxW: number, maxH: number) => void;
  logo: (dataUri?: string, hMm?: number) => void;
  photos: (photoList: { d: string; c?: string; w: number; h: number }[], barFill?: [number, number, number], textCol?: [number, number, number]) => void;
  chart: (commands: any[], x: number, y: number, scale: number) => void;
  blob: () => Blob;
}

export function createPDFHelper({ landscape = false } = {}): PDFHelper {
  const doc = new jsPDF({
    unit: "mm",
    format: "letter",
    orientation: landscape ? "landscape" : "portrait"
  });

  const X = 12;
  const W = landscape ? 255.4 : 192;
  const maxY = landscape ? 203 : 270;

  const helper: PDFHelper = {
    D: doc,
    X,
    W,
    y: 12,
    C: m,
    landscape,
    tx(text, x, y, opt = {}) {
      doc.setFont("helvetica", opt.b ? "bold" : "normal");
      doc.setFontSize(opt.s || 9);
      doc.setTextColor(...(opt.c || [0, 0, 0]));
      doc.text(text, x, y, opt.a && opt.a !== "l" ? { align: opt.a === "c" ? "center" : "right" } : undefined);
    },
    bx(x, y, w, h, fill) {
      doc.setDrawColor(90, 90, 90);
      doc.setLineWidth(0.2);
      if (fill) {
        doc.setFillColor(...fill);
        doc.rect(x, y, w, h, "FD");
      } else {
        doc.rect(x, y, w, h);
      }
    },
    sp(text, width, size = 9) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      return doc.splitTextToSize(String(text != null ? text : ""), width);
    },
    h(items, { lh = 4, pad = 3, min = 6 } = {}) {
      const maxLines = Math.max(
        ...items.map(([txt, w, s]) => helper.sp(txt, w - 3, s || 8.5).length)
      );
      return Math.max(min, maxLines * lh + pad);
    },
    page() {
      doc.addPage();
      helper.y = 12;
    },
    pg(needed) {
      if (helper.y + needed > maxY) {
        helper.page();
        return true;
      }
      return false;
    },
    cell(x, y, w, h, text, opt = {}) {
      const fontSize = opt.s || 9;
      const pad = opt.pad != null ? opt.pad : 1.5;
      const lines = helper.sp(text, w - 2 * pad, fontSize);
      helper.bx(x, y, w, h, opt.f);
      if (!lines.length || lines[0] === "") return;

      const lineStep = fontSize * 0.42;
      const baselineY =
        opt.v === "t"
          ? y + 1.2 + fontSize * 0.3
          : y + h / 2 - ((lines.length - 1) * lineStep) / 2 + fontSize * 0.14;
      const align = opt.a || "c";
      const targetX = align === "l" ? x + pad : align === "r" ? x + w - pad : x + w / 2;

      helper.tx(lines, targetX, baselineY, {
        s: fontSize,
        b: opt.b,
        c: opt.c,
        a: align
      });
    },
    tr(colWidths, values, rowHeight, opt = {}) {
      let curX = opt.x != null ? opt.x : X;
      values.forEach((val, idx) => {
        const width = colWidths[idx];
        helper.cell(curX, helper.y, width, rowHeight, val, {
          f: (opt.fill && opt.fill[idx]) || (opt.g ? m.GY : undefined),
          b: Array.isArray(opt.b) ? opt.b[idx] : opt.b,
          s: opt.s,
          a: (opt.left || []).includes(idx) ? "l" : "c",
          v: opt.vs ? opt.vs[idx] : opt.v,
          c: opt.c
        });
        curX += width;
      });
      helper.y += rowHeight;
    },
    bar(text, fill, opt = {}) {
      const height = opt.h || 6.5;
      helper.pg(height);
      helper.bx(X, helper.y, W, height, fill);
      helper.tx(
        text,
        opt.a === "l" ? X + 1.5 : X + W / 2,
        helper.y + height - 1.8,
        { b: 1, s: opt.s || 10, c: opt.c, a: opt.a === "l" ? "l" : "c" }
      );
      if (opt.r) {
        helper.tx(opt.r, X + W - 2, helper.y + height - 1.8, {
          b: 1,
          s: opt.s || 10,
          c: opt.c,
          a: "r"
        });
      }
      helper.y += height;
    },
    note(text, { c: col, s: size = 9, f: fill } = {}) {
      if (!text) return;
      const lines = helper.sp(text, W - 4, size);
      const needed = lines.length * 4 + 2;
      helper.pg(needed);
      helper.bx(X, helper.y, W, needed, fill);
      helper.tx(lines, X + 1.5, helper.y + 4, { s: size, c: col });
      helper.y += needed;
    },
    para(text, { s: size = 8, c: col } = {}) {
      const lines = helper.sp(text, W - 2, size);
      const needed = lines.length * size * 0.42 + 3;
      helper.pg(needed);
      helper.tx(lines, X + 1, helper.y + 3, { s: size, c: col });
      helper.y += needed;
    },
    kv(key, val, x, y) {
      helper.tx(key, x, y, { b: 1 });
      helper.tx(String(val || "-"), x + doc.getTextWidth(key) + 2, y);
    },
    lv(key, val, x, width, height = 6) {
      helper.bx(x, helper.y, width, height, m.GY);
      helper.tx(key, x + 1.5, helper.y + height - 1.9, { b: 1, s: 8, c: m.TL });
      helper.tx(String(val || ""), x + doc.getTextWidth(key) + 4, helper.y + height - 1.9, { s: 8 });
    },
    cb(x, y, checked) {
      helper.bx(x, y - 3.4, 4.5, 4.5);
      if (checked) helper.tx("X", x + 1.1, y, { b: 1 });
    },
    img(dataUri, x, y, maxW, maxH) {
      if (dataUri) {
        try {
          const props = doc.getImageProperties(dataUri);
          const factor = Math.min((maxW - 2) / props.width, (maxH - 2) / props.height);
          doc.addImage(dataUri, x + 1, y + 1, props.width * factor, props.height * factor);
        } catch (e) {
          console.warn("Could not render image in PDF:", e);
        }
      }
    },
    logo(dataUri = HOLCIM_LOGO, hMm = 15) {
      if (dataUri) {
        try {
          doc.addImage(dataUri, "PNG", X, helper.y, hMm * Ut, hMm);
        } catch (e) {
          console.warn("Could not render logo:", e);
        }
      }
    },
    photos(photoList, barFill = m.BL, textCol) {
      const perPage = landscape ? 1 : 2;
      const targetW = landscape ? 230 : 170;
      const targetH = landscape ? 150 : 105;

      photoList.forEach((photo, idx) => {
        if (idx % perPage === 0) {
          helper.page();
          helper.bar("Fotos", barFill, { c: textCol });
          helper.y += 3;
        }
        const factor = Math.min(targetW / photo.w, targetH / photo.h);
        if (photo.c) {
          helper.tx(photo.c, X, helper.y, { s: 9 });
          helper.y += 4;
        }
        try {
          doc.addImage(photo.d, "JPEG", X, helper.y, photo.w * factor, photo.h * factor);
        } catch (e) {
          console.warn("Could not render photo:", e);
        }
        helper.y += photo.h * factor + 6;
      });
    },
    chart(commands, startX, startY, scale) {
      doc.setLineDashPattern([], 0);
      commands.forEach(cmd => {
        const rgb = Ya[cmd.c] || [0, 0, 0];
        if (cmd.k === "l") {
          doc.setDrawColor(...rgb);
          doc.setLineWidth((cmd.w || 1) * scale);
          doc.setLineDashPattern(cmd.d ? cmd.d.split(" ").map((f: string) => Number(f) * scale) : [], 0);
          doc.line(
            startX + cmd.x1 * scale,
            startY + cmd.y1 * scale,
            startX + cmd.x2 * scale,
            startY + cmd.y2 * scale
          );
          doc.setLineDashPattern([], 0);
        } else if (cmd.k === "c") {
          doc.setFillColor(...rgb);
          doc.circle(startX + cmd.x * scale, startY + cmd.y * scale, cmd.r * scale, "F");
        } else if (cmd.k === "t") {
          doc.setFont("helvetica", cmd.b ? "bold" : "normal");
          doc.setFontSize(cmd.s * scale * 2.835 * 0.62);
          doc.setTextColor(...rgb);
          doc.text(cmd.t, startX + cmd.x * scale, startY + cmd.y * scale, {
            align: cmd.a === "c" ? "center" : cmd.a === "r" ? "right" : "left"
          });
        }
      });
    },
    blob() {
      return doc.output("blob");
    }
  };

  return helper;
}

export async function preparePdfAssets(v: Record<string, any>, photos: PhotoItem[]) {
  const sigs: Record<string, string> = {};
  for (const [k, obj] of urlCache.entries()) {
    if (k.startsWith("sig:")) {
      const sigKey = k.replace("sig:", "");
      if (v[sigKey]) {
        sigs[sigKey] = await blobToDataUrl(obj.blob);
      }
    }
  }

  const exportPhotos: { d: string; c?: string; w: number; h: number }[] = [];
  for (const p of photos) {
    const cached = urlCache.get("photo:" + p.id);
    if (cached) {
      exportPhotos.push({
        d: await blobToDataUrl(cached.blob),
        c: p.c,
        w: p.w,
        h: p.h
      });
    }
  }

  return { logo: HOLCIM_LOGO, sig: sigs, photos: exportPhotos };
}

// 1. CEM's Weekly Report (c)
export function generateCemsPdf({ v, assets }: { v: Record<string, any>; assets: any }) {
  const p = createPDFHelper();
  const { X, W } = p;

  p.logo(assets.logo);
  p.y += 18;
  p.bar("TC.421-2K1 Inspección Semanal", m.BL, { s: 16, h: 10, a: "l", r: v.fecha || "-" });
  p.bar("Inspector: " + (v.insp || "-"), m.WH, { a: "l", s: 9 });
  p.bar("TC.421-2K1 MTTO PREVENTIVO CEM’s DIARIO", m.BL);

  const instr = "Instrucciones: Realice diariamente estas inspecciones en el CEM’s. Marque con un OK si la inspección está sin anomalías; si existen anomalías, escriba sus observaciones.";
  const hInstr = p.h([[instr, W, 9]], { lh: 4, pad: 2 });
  p.cell(X, p.y, W, hInstr, instr, { a: "l", v: "t" });
  p.y += hInstr;

  const colW = [90, 12, 12, 12, 12, 12, 42];
  const colFills = [null, m.CB, m.CB, m.CB, m.CB, m.CB, m.CB];
  p.tr(colW, ["", "Lunes", "Martes", "Miérc.", "Jueves", "Viernes", "Observaciones:"], 6, { s: 7 });

  K.forEach((txt, idx) => {
    const obs = v["d" + idx + "_o"] || "Ninguna";
    const rowH = p.h([[txt, 90, 8.5], [obs, 42, 8.5]]);
    p.pg(rowH);
    p.tr(
      colW,
      [txt, ...Y.map((_, s) => ({ ok: "OK", obs: "Obs" } as any)[v[`d${idx}_${s}`]] || ""), obs],
      rowH,
      { fill: colFills, left: [0], s: 8.5, vs: ["t"] }
    );
  });

  p.bar("MTTO PREVENTIVO CEM’s SEMANAL", m.BL);
  let lastSub = "";

  Ae(v).filter(c => c.sec === "Revisión semanal").forEach(item => {
    const prefix = item.t.split(" ")[0];
    if (Ze[prefix] && prefix !== lastSub) {
      lastSub = prefix;
      p.bar(Ze[prefix], m.GM, { s: 9, a: "l" });
    }
    const valText = item.ty === "ok" ? ({ ok: "ok", obs: "obs" } as any)[v[item.id]] || "" : v[item.id] || "";
    p.pg(6.2);
    p.tr([144, 36, 12], [item.t, valText, ""], 6.2, {
      fill: [null, m.CB, (m.ST as any)[item.st]],
      left: [0]
    });
    if (v[item.id + "_o"]) {
      p.note("Observación: " + v[item.id + "_o"], { c: m.RED });
    }
  });

  p.bar("4.- Gases (parte superior del cuarto del CEM’s)", m.BL);
  re.forEach(([gasId, name, conc, outPress, hasExp], idx) => {
    const evalGas = ze(v, gasId, outPress, hasExp);
    p.bar(`4.${idx + 1}-GAS ${name.toUpperCase()}` + (conc ? "      Concentración: " + conc : ""), m.GM, { s: 9, a: "l" });

    const addGasRow = (label: string, value: any, status: string) => {
      p.pg(6.2);
      p.tr([144, 36, 12], [label, value, ""], 6.2, {
        fill: [null, m.CB, (m.ST as any)[status]],
        left: [0]
      });
    };

    addGasRow("Revisión presión total del cilindro (PSI)", v[gasId + "_t"], evalGas.t);
    if (outPress) {
      addGasRow(`Revisión presión de salida del cilindro (${outPress} BAR)`, v[gasId + "_s"], evalGas.s);
    }
    if (hasExp) {
      addGasRow("Fecha de caducidad del gas", v[gasId + "_e"], evalGas.e);
    }
    if (v[gasId + "_o"]) {
      p.note("Observación: " + v[gasId + "_o"], { c: m.RED });
    }
  });

  p.photos(assets.photos);
  return p.blob();
}

// 2. Pesadoras (p)
export function generatePesadorasPdf({ v, assets }: { v: Record<string, any>; assets: any }) {
  const a = Re(v);
  const t = createPDFHelper();
  const { X: r, W: n } = t;

  t.logo(assets.logo);
  t.y += 18;
  t.bar("PESADA DE MATERIAL PARA BANDAS PESADORAS", m.BL, { s: 13, h: 10 });
  t.y += 4;

  const rowKv = (k1: [string, any], _: any, k2?: [string, any]) => {
    t.kv(k1[0], k1[1], r, t.y);
    if (k2) t.kv(k2[0], k2[1], r + 70, t.y);
    t.y += 5;
  };

  rowKv(["Área:", v.p_area], 0, ["Pesadora a verificar (HAC):", v.p_hac]);
  rowKv(["Material:", v.p_mat], 0, ["Báscula marca:", v.p_marca]);
  rowKv(["Turno:", v.p_tur], 0, ["Fecha:", v.fecha]);
  t.y += 1;
  t.kv("Nombre del ejecutor de la actividad:", v.insp, r, t.y);
  t.y += 6;
  rowKv(["Valor Factor K:", v.p_k], 0, ["Altura de la cama de material:", v.p_alt]);
  t.kv("Cantidad de material a pesar (kg):", v.p_cant, r, t.y);
  t.y += 5;
  t.kv("Fecha de calibración del patrón utilizado:", v.p_fcal, r, t.y);
  t.y += 5;

  const colW = [72, 30, 30, 30, 30];
  const renderSamplesTable = (title: string, key: 'a' | 'b', count: number) => {
    t.tx(title, r + n / 2, t.y + 2, { b: 1, s: 10, a: "c" });
    t.y += 4;
    const subset = (a as any)[key];
    t.tr(colW, ["", "Muestra 1", "Muestra 2", "Muestra 3", "Promedio"], 6, { s: 9 });
    J.forEach(([code, label, hasInput]) => {
      t.tr(
        colW,
        [
          label,
          ...[0, 1, 2].map(idx => (idx < count ? g(subset.cs[idx][code], 2) : "")),
          g(subset.A[code], 2)
        ],
        6,
        {
          fill: [null, ...[0, 1, 2].map(() => (hasInput ? null : m.GY)), m.GY],
          left: [0],
          s: 8.5
        }
      );
    });
    t.y += 5;
  };

  renderSamplesTable("Pesadas de material sin corrección", "a", 3);
  renderSamplesTable("Pesadas de material después de corrección", "b", 1);

  t.kv("Valor Final Factor K:", a.kf == null ? "-" : a.kf.toFixed(5), r, t.y);
  t.y += 7;
  t.tx("OBSERVACIONES:", r, t.y, { b: 1 });
  t.y += 3;
  const obsH = Math.max(t.h([[v.p_obs, n, 9]], { lh: 4, pad: 3 }), 16);
  t.cell(r, t.y, n, obsH, v.p_obs, { a: "l", v: "t" });

  // Page 2: Registro de resultados
  t.page();
  t.bx(r, t.y, n, 252);
  t.y += 8;
  t.tx("REGISTRO DE RESULTADOS DE CALIBRACION Y/O VERIFICACION INTERNA", r + n / 2, t.y, { b: 1, s: 10, a: "c" });
  t.y += 10;
  t.kv("PLANTA:", "HOLCIM MÉXICO OPERACIONES, PLANTA TECOMÁN", r + 3, t.y);
  t.kv("FECHA:", v.fecha, r + 140, t.y);
  t.y += 9;

  const renderSection = (title: string, list: [string, any][]) => {
    t.tx(title, r + n / 2, t.y, { b: 1, s: 9.5, a: "c" });
    t.y += 6;
    list.forEach(([k, val]) => {
      t.kv(k, val, r + 3, t.y);
      t.y += 4.8;
    });
  };

  renderSection("EQUIPO BAJO CALIBRACIÓN Y/O VERIFICACIÓN", [
    ["DESCRIPCIÓN EQUIPO:", v.p_desc],
    ["MARCA:", v.p_marca],
    ["MODELO:", v.p_modelo],
    ["N° SERIE:", v.p_serie],
    ["CODIGO:", v.p_hac],
    ["RESOLUCIÓN:", v.p_res],
    ["UBICACIÓN:", v.p_area]
  ]);
  t.y += 4;

  renderSection("PATRONES UTILIZADOS EN LA CALIBRACIÓN Y/O VERIFICACIÓN", [
    ["DESCRIPCIÓN PATRONES:", v.p_pdesc],
    ["MARCA:", v.p_pmarca],
    ["MODELO:", v.p_pmodelo],
    ["CODIGO:", v.p_pcod],
    ["CALIBRADO POR:", v.p_pcal],
    ["TRAZABILIDAD:", v.p_ptraz],
    ["FECHA DE CALIBRACIÓN:", v.p_fcal],
    ["VIGENCIA:", (v.p_pvig || "-") + " Meses"],
    ["INFORME:", v.p_pinf]
  ]);

  if (a.vencido) {
    t.tx("Patrón vencido desde " + a.venc, r + 3, t.y, { b: 1, c: m.RED });
    t.y += 4.8;
  }
  t.y += 5;

  t.tx("ACCION TOMADA:", r + 3, t.y, { b: 1 });
  t.tx("VERIFICACION", r + 50, t.y);
  t.cb(r + 80, t.y, v.p_acc === "ver");
  t.tx("CALIBRACIÓN", r + 110, t.y);
  t.cb(r + 137, t.y, v.p_acc === "cal");
  t.y += 10;

  t.tx("RESULTADOS", r + n / 2, t.y, { b: 1, s: 10, a: "c" });
  t.y += 4;
  const resultLabel = a.ok == null ? "" : a.ok ? "ACEPTABLE" : "NO ACEPTABLE";
  const resColW = [40, 24, 48, 40, 40];
  t.tr(resColW, ["PATRÓN", "UNIDADES", "EQUIPO", "ERROR", "RESULTADO"], 6.5, { g: 1, b: 1 });
  t.tr(
    resColW,
    [g(a.a.A.ne, 2), "kg", g(a.b.A.rg, 2), a.pe == null ? "" : g(a.pe, 2) + " %", resultLabel],
    6.5,
    {
      fill: [undefined, undefined, undefined, undefined, resultLabel ? (a.ok ? m.ST.good : m.ST.bad) : null],
      b: [0, 0, 0, 0, 1]
    }
  );

  t.y += 8;
  t.tx("OBSERVACIONES:", r + 3, t.y, { b: 1 });
  t.y += 2;
  const p2ObsH = Math.max(t.h([[v.p_obs, n - 6, 9]], { lh: 4, pad: 3 }), 20);
  t.cell(r + 3, t.y, n - 6, p2ObsH, v.p_obs, { a: "l", v: "t" });
  t.y += p2ObsH + 10;

  t.tx("RESULTADOS DESPUÉS DE LA VERIFICACIÓN O CALIBRACIÓN:", r + 3, t.y, { b: 1 });
  t.tx("ACEPTABLE:", r + 112, t.y);
  t.cb(r + 132, t.y, a.ok === true);
  t.tx("NO ACEPTABLE:", r + 146, t.y);
  t.cb(r + 172, t.y, a.ok === false);
  t.y += 9;

  t.kv("FECHA DE PRÓXIMA VERIFICACIÓN Y/O CALIBRACIÓN:", v.p_prox, r + 3, t.y);
  t.y += 12;
  t.kv("REALIZADO POR:", v.insp, r + 3, t.y);
  t.kv("AUTORIZADO POR:", v.p_aut, r + 105, t.y);

  t.photos(assets.photos);
  return t.blob();
}

function renderPatronGasesTable(e: PDFHelper, v: Record<string, any>) {
  e.tx("Gases patrón utilizados", e.X, e.y, { b: 1, s: 9.5 });
  e.y += 3;
  const colW = [64, 43, 43, 42];
  e.tr(colW, ["Gas", "Concentración", "Peso molecular", "mg/m³"], 5.5, { g: 1, b: 1, s: 8 });
  he.forEach(([gasId, name, unit, hasPm]) =>
    e.tr(
      colW,
      [
        name,
        (v["g_c_" + gasId] || "-") + " " + unit,
        hasPm ? v["g_m_" + gasId] || "-" : "",
        hasPm ? g(ee(v, gasId), 2) : ""
      ],
      5.5,
      { left: [1], s: 8 }
    )
  );
}

// 3. Verificación con Gases Patrón (g)
export function generateGasesPdf({ v, assets }: { v: Record<string, any>; assets: any }) {
  if (v.g_ori === "h") {
    // Landscape
    const a = createPDFHelper({ landscape: true });
    const { X: t, W: r } = a;
    a.logo(assets.logo);
    a.y += 18;
    a.bar("TC421-2K1 VERIFICACIÓN CON GASES PATRÓN", m.BL, { s: 14, h: 10, a: "l", r: v.fecha || "-" });
    a.y += 5;
    a.tx("Fecha verif.:", t, a.y, { b: 1 });
    a.tx(v.fecha || "-", t + 23, a.y);
    a.tx("Realizó:", t + 60, a.y, { b: 1 });
    a.tx(v.insp || "-", t + 75, a.y);
    a.tx("Línea:", t + 140, a.y, { b: 1 });
    a.tx(v.g_lin || "-", t + 152, a.y);
    a.tx("Error aceptable: ± " + (v.g_tol || "-") + " %", t + r, a.y, { b: 1, a: "r" });
    a.y += 6;

    const labelW = 22;
    const gasW = (r - labelW) / 6;
    const subColW = gasW / 3;
    const tableTop = a.y;

    a.bx(t, tableTop, labelW, 10, m.GY);
    B.forEach(([_, name], idx) => {
      const colX = t + labelW + idx * gasW;
      a.bx(colX, tableTop, gasW, 5, m.GY);
      a.tx(name, colX + gasW / 2, tableTop + 3.7, { b: 1, a: "c" });
      ["Patrón", "Real", "Error"].forEach((header, sIdx) => {
        a.bx(colX + sIdx * subColW, tableTop + 5, subColW, 5, m.GY);
        a.tx(header, colX + sIdx * subColW + subColW / 2, tableTop + 8.6, { s: 6.5, a: "c" });
      });
    });
    a.y += 10;

    const renderLandscapeRow = (rowTitle: string, mapping: Record<string, string>, fSize?: number) => {
      const curY = a.y;
      a.bx(t, curY, labelW, 6);
      a.tx(rowTitle, t + 1.5, curY + 4.2, { s: fSize || 8, b: 1 });
      B.forEach(([gasId], idx) => {
        const colX = t + labelW + idx * gasW;
        const analitoKey = mapping[gasId];
        for (let u = 0; u < 3; u++) a.bx(colX + u * subColW, curY, subColW, 6);
        if (!analitoKey) return;
        const evalRes = ce(v, analitoKey);
        a.tx(g(evalRes.p, 2), colX + subColW / 2, curY + 4, { s: 6.5, a: "c" });
        a.tx(g(evalRes.r, 2), colX + subColW * 1.5, curY + 4, { s: 6.5, a: "c" });
        a.bx(colX + 2 * subColW, curY, subColW, 6, (m.ST as any)[evalRes.st]);
        a.tx(
          evalRes.e != null ? g(evalRes.e, 2) : evalRes.d != null ? "dif " + g(evalRes.d, 2) : "",
          colX + subColW * 2.5,
          curY + 4,
          { s: 6.5, a: "c" }
        );
      });
      a.y += 6;
    };

    renderLandscapeRow("Zero", { o2: "o2z", toc: "tcz" });
    renderLandscapeRow("Span", { o2: "o2s", toc: "tcs", so2: "so2", co: "co", no: "no", co2: "co2" });

    a.bx(t, a.y, labelW, 6);
    a.tx("Presión cil.", t + 1.5, a.y + 4.2, { s: 8, b: 1 });
    B.forEach(([gasId], idx) => {
      const colX = t + labelW + idx * gasW;
      const pVal = v["g_ps_" + gasId];
      a.bx(colX, a.y, gasW, 6, (m.ST as any)[le(v, gasId)]);
      if (pVal) a.tx(pVal + " psi", colX + gasW / 2, a.y + 4.2, { s: 7, a: "c" });
    });
    a.y += 9;

    a.tx("Nota: La verificación del Span del TOC se realiza en el menú de calibración manual.", t, a.y, { s: 8 });
    a.y += 4.5;
    a.tx("% Error = (Valor medido - Valor patrón) / Valor patrón x 100", t, a.y, { s: 8 });
    a.y += 5.5;
    a.tx("Se ajusta Zero O2:", t, a.y, { b: 1 });
    a.cb(t + 30, a.y, !!v.g_adz);
    a.tx("Se ajusta Span O2:", t + 45, a.y, { b: 1 });
    a.cb(t + 75, a.y, !!v.g_ads);
    a.y += 8;

    renderPatronGasesTable(a, v);
    a.y += 5;
    a.tx("OBSERVACIONES:", t, a.y, { b: 1 });
    a.y += 2;
    const obsH = Math.max(a.h([[v.g_obs, r, 9]], { pad: 3 }), 14);
    a.cell(t, a.y, r, obsH, v.g_obs, { a: "l", v: "t" });
    a.y += obsH + 6;
    a.tx("Realizó:", t, a.y, { b: 1 });
    a.tx(v.insp || "-", t + 16, a.y);
    a.photos(assets.photos);
    return a.blob();
  }

  // Portrait
  const a = createPDFHelper();
  const { X: t, W: r } = a;
  a.logo(assets.logo);
  a.y += 18;
  a.bar("TC421-2K1 VERIFICACIÓN CON GASES PATRÓN", m.BL, { s: 13, h: 10, a: "l", r: v.fecha || "-" });
  a.y += 5;
  a.tx("Fecha verif.:", t, a.y, { b: 1 });
  a.tx(v.fecha || "-", t + 23, a.y);
  a.tx("Realizó:", t + 60, a.y, { b: 1 });
  a.tx(v.insp || "-", t + 75, a.y);
  a.tx("Línea:", t + 140, a.y, { b: 1 });
  a.tx(v.g_lin || "-", t + 152, a.y);
  a.y += 5.5;
  a.tx("Error aceptable: ± " + (v.g_tol || "-") + " %", t, a.y, { b: 1 });
  a.y += 3;

  const colW = [24, 22, 20, 30, 30, 30, 36];
  a.tr(colW, ["Analito", "Medición", "Unidad", "Patrón", "Real", "Error (%)", "Estado"], 6.5, { g: 1, b: 1, s: 8.5 });
  let lastGas = "";

  se.forEach(([key, gasId, type, unit]) => {
    const evalRes = ce(v, key);
    const gasName = B.find(b => b[0] === gasId)![1];
    a.tr(
      colW,
      [
        gasName !== lastGas ? gasName : "",
        type,
        unit,
        g(evalRes.p, 2),
        g(evalRes.r, 2),
        evalRes.e != null ? g(evalRes.e, 2) : evalRes.d != null ? "dif. " + g(evalRes.d, 2) : "",
        evalRes.st === "bad" ? "ERROR" : evalRes.st === "good" ? "Correcto" : ""
      ],
      6.5,
      {
        fill: [null, null, null, null, null, null, (m.ST as any)[evalRes.st]],
        left: [1],
        s: 8.5
      }
    );
    lastGas = gasName;
  });

  a.y += 5;
  a.tx("Nota: La verificación del Span del TOC se realiza en el menú de calibración manual.", t, a.y, { s: 8 });
  a.y += 4.5;
  a.tx("% Error = (Valor medido - Valor patrón) / Valor patrón x 100", t, a.y, { s: 8 });
  a.y += 6;
  a.tx("Se ajusta Zero O2:", t, a.y, { b: 1 });
  a.cb(t + 30, a.y, !!v.g_adz);
  a.tx("Se ajusta Span O2:", t + 45, a.y, { b: 1 });
  a.cb(t + 75, a.y, !!v.g_ads);
  a.y += 8;

  a.tx("Presión de cilindros patrón", t, a.y, { b: 1, s: 9.5 });
  a.y += 3;
  const pColW = [50, 71, 71];
  a.tr(pColW, ["Gas", "Presión (psi)", "Estado"], 5.5, { g: 1, b: 1, s: 8.5 });
  B.forEach(([gasId, name]) => {
    const st = le(v, gasId);
    a.tr(pColW, [name, v["g_ps_" + gasId] || "-", (Xt as any)[st] || "-"], 5.5, {
      fill: [undefined, undefined, (m.ST as any)[st]],
      s: 8.5
    });
  });

  a.y += 6;
  renderPatronGasesTable(a, v);
  a.y += 6;
  a.tx("OBSERVACIONES:", t, a.y, { b: 1 });
  a.y += 2;
  const obsH = Math.max(a.h([[v.g_obs, r, 9]], { pad: 3 }), 16);
  a.cell(t, a.y, r, obsH, v.g_obs, { a: "l", v: "t" });
  a.y += obsH + 7;
  a.tx("Realizó:", t, a.y, { b: 1 });
  a.tx(v.insp || "-", t + 16, a.y);

  a.photos(assets.photos);
  return a.blob();
}

// 4. Pruebas Estáticas a Motores (e)
export function generateMotoresPdf({ v, assets }: { v: Record<string, any>; assets: any }) {
  const a = Oe(v);
  const t = createPDFHelper();
  const { X: r, W: n } = t;

  t.logo(assets.logo);
  t.tx("REPORTE TÉCNICO", r + n / 2, t.y + 5, { b: 1, s: 14, a: "c" });
  t.tx("Pruebas Estáticas a Motores", r + n / 2, t.y + 10.5, { b: 1, s: 11, a: "c" });
  t.tx("Holcim Planta Tecoman", r + n / 2, t.y + 15.5, { b: 1, s: 9.5, a: "c" });
  t.y += 19;

  const motorData: [string, any][] = [
    ["Fecha", v.fecha],
    ["Realizado por:", v.insp],
    ["HAC", v.e_hac],
    ["Pieza", v.e_pieza],
    ["Ubicación", v.e_ubic],
    ["No. Serie", v.e_serie],
    ["Potencia", v.e_pot],
    ["RPM", v.e_rpm],
    ["Volts", v.e_volts],
    ["Ampers", v.e_amp],
    ["Aisl. Cls.", v.e_aisl],
    ["Marca", v.e_marca],
    ["Prueba realizada en:", v.e_prueba],
    ["Temp. de prueba (°C)", v.e_temp],
    ["Voltaje de prueba (VCD)", v.e_vtest],
    ["Factor Kt", a.kt == null ? "" : a.kt.toFixed(4)]
  ];

  for (let d = 0; d < 8; d++) {
    const curY = t.y + d * 5.5;
    [0, 1].forEach(colIdx => {
      const [lbl, val] = motorData[d + colIdx * 8];
      const colX = r + colIdx * 96;
      t.cell(colX, curY, 34, 5.5, lbl, { f: m.GY, b: 1, s: 8, a: "l" });
      t.cell(colX + 34, curY, 62, 5.5, val, { s: 8.5, a: "l" });
    });
  }

  t.y += 8 * 5.5 + 4;
  t.tx("Ref. IEEE 43-2000", r, t.y + 3, { s: 8 });
  t.tx("Reporte de Pruebas Eléctricas", r + n / 2, t.y + 3, { b: 1, s: 10, a: "c" });
  t.y += 6;

  const testColW = [50, 48, 22, 14, 32, 26];
  t.tr(testColW, ["Prueba", "Especificación", "Resultado", "Ing.", "Observaciones", "Dictamen"], 6, {
    fill: testColW.map(() => m.BL),
    b: 1,
    s: 8
  });

  const testRows: [string, string, string, string, any][] = [
    ["Resistencia de Aislamiento con respecto a tierra al min.", "MOhms mínimo = " + (v.e_min || "-"), g(a.ir, 2), "Gohms", v.e_o0],
    ["Factor de Absorción", "< 1 Peligroso, 1.0 a 1.4 Cuestionable, 1.4 a 1.6 Bueno, > 1.6 Excelente", g(a.da, 2), "FA", v.e_o1],
    ["Índice de Polarización", "< 1 Peligroso, 1.0 a 2.0 Cuestionable, 2.0 a 4.0 Bueno, > 4.0 Excelente", g(a.ip, 2), "IP", v.e_o2],
    ["Ensayo de descarga dieléctrica", "> 4 Malo, 2 a 4 Crítico, < 2 Bueno", g(a.dd, 2), "DD", v.e_o3]
  ];

  testRows.forEach((row, idx) => {
    const verdict = a.d[idx];
    t.tr(testColW, [...row, verdict ? verdict[0] : ""], 11.5, {
      fill: [m.LG, m.LG, m.LG, m.LG, m.LG, verdict ? (m.ST as any)[verdict[1]] : m.LG],
      s: 7.5,
      left: [0, 1],
      b: [0, 0, 0, 0, 0, 1]
    });
  });

  t.y += 3;
  t.chart(Be(a), r, t.y, n / 640);
  t.y += (300 * n) / 640 + 3;

  const bottomY = t.y;
  t.bx(r, bottomY, 96, 5.5, m.GY);
  t.tx("Nota", r + 48, bottomY + 4, { b: 1, s: 8.5, a: "c" });
  t.cell(r, bottomY + 5.5, 96, 27.5, v.e_nota, { f: m.LG, s: 8.5 });

  t.bx(r + 96, bottomY, 96, 5.5, m.GY);
  t.tx("Datos Adicionales de la Prueba", r + 144, bottomY + 4, { b: 1, s: 8.5, a: "c" });

  const extraTests: [string, any][] = [
    ["Resistencia L1-L2 (mOhms)", v.e_l12],
    ["Resistencia L1-L3 (mOhms)", v.e_l13],
    ["Resistencia L2-L3 (mOhms)", v.e_l23],
    ["nA", v.e_na],
    ["nF", v.e_nf]
  ];

  extraTests.forEach(([label, val], idx) => {
    const fY = bottomY + 5.5 + idx * 5.5;
    t.cell(r + 96, fY, 66, 5.5, label, { f: m.GY, s: 8, a: "l" });
    t.cell(r + 162, fY, 30, 5.5, val, { s: 8.5 });
  });

  // Page 2: Table of readings
  t.page();
  t.bar("VALORES DE RESISTENCIA DE AISLAMIENTO TOMADOS EN CAMPO", m.BL, { h: 7 });
  t.y += 4;
  t.tx(
    `Temperatura de prueba: ${v.e_temp || "-"} °C   ·   Factor Kt: ${a.kt == null ? "-" : a.kt.toFixed(4)}   ·   Voltaje de prueba: ${v.e_vtest || "-"} VCD`,
    r,
    t.y,
    { s: 9 }
  );
  t.y += 4;

  const readColW = [40, 76, 76];
  t.tr(readColW, ["Tiempo", "Resistencia medida (GOhms)", "Corregida a 40 °C (GOhms)"], 7, {
    fill: readColW.map(() => m.BL),
    b: 1,
    s: 8.5
  });

  q.forEach((minute, idx) => {
    t.tr(readColW, [ge[idx], g(a.r[idx], 3), g(a.c[idx], 3)], 6.2, {
      fill: minute === 1 || minute === 10 ? [m.GY, m.GY, m.GY] : undefined
    });
  });

  t.y += 5;
  t.tx("Kt = 0.5 ^ ((40 - T) / 10)      FA = R(1 min) / R(0.5 min)      IP = R(10 min) / R(1 min)", r, t.y, { s: 8 });
  t.y += 4.5;
  t.tx("Los renglones sombreados (1 min y 10 min) son los que se usan para el IP y la resistencia al minuto.", r, t.y, { s: 8 });

  t.photos(assets.photos);
  return t.blob();
}

// 5. Dosificadores Pfister (f)
export function generatePfisterPdf({ v, assets }: { v: Record<string, any>; assets: any }) {
  const a = Pe(v);
  const t = createPDFHelper();
  const { X: r, W: n } = t;

  t.logo(assets.logo);
  t.y += 18;
  t.bar("Dosificadores PFister", m.BL, { s: 14, h: 10 });
  t.y += 4;

  const pfisterHeader: [string, any][] = [
    ["Fecha:", v.fecha],
    ["Realizado por:", v.insp],
    ["HAC:", v.f_hac],
    ["Modelo Pfister:", v.f_mod]
  ];

  pfisterHeader.forEach(([lbl, val]) => {
    t.tx(lbl, r, t.y, { b: 1 });
    t.tx(String(val || "-"), r + 45, t.y);
    t.y += 5.5;
  });
  t.y += 3;

  const pfColW = [100, 36, 30, 26];
  const eo: Record<string, string> = { good: "Correcto", warn: "Fuera de tol.", bad: "ERROR" };

  const addPfisterRow = (label: string, v1: any, v2?: any, status?: string) => {
    t.pg(6.2);
    t.tr(pfColW, [label, v1 != null ? v1 : "", v2 != null ? v2 : "", status ? eo[status] : ""], 6.2, {
      fill: [undefined, undefined, (m.ST as any)[status || ""], (m.ST as any)[status || ""]],
      left: [0],
      s: 9
    });
  };

  const addSectionBar = (title: string, rVal?: string) => t.bar(title, m.CB, { s: 9.5, r: rVal });
  const addInstruction = (txt: string) => t.para(txt, { s: 8.5, c: [0, 0, 0] });

  addSectionBar("COMPENSACION CARGA MUERTA", "Valor ideal: 0.0 kg/U · 0.00 %");
  t.para(O.muerta, { s: 7.5 });
  addInstruction(O.antes);
  addPfisterRow("Carga Inicial kg/U (0,00):", v.f_z1);
  addPfisterRow("Carga Inicial % (0.0):", v.f_z2);
  addInstruction(O.despuesM);
  addPfisterRow("Carga Final 1 kg/U (0.00):", v.f_z3);
  addPfisterRow("Carga Final % (0.0):", v.f_z4);
  t.y += 3;

  addSectionBar("SPAN PFISTER", "Error %");
  addPfisterRow("Valor Nominal de Calibración kg/U:", v.f_nom);
  t.para(O.span, { s: 7.5 });
  addInstruction(O.antes);
  addPfisterRow("Carga Inicial kg/U:", v.f_si, a.ei == null ? "" : g(a.ei, 4), a.sti);
  addInstruction(O.despuesS);
  addPfisterRow("Carga Final 1 kg/U:", v.f_s1, a.ef == null ? "" : g(a.ef, 4), a.stf);
  addPfisterRow("Carga Final 2 kg/U:", v.f_s2);
  addPfisterRow("Carga Final 3 kg/U:", v.f_s3);
  t.para(O.retire, { s: 7.5 });
  addPfisterRow("Carga kg/U:", v.f_rk);
  addPfisterRow("Carga %:", v.f_rp);
  t.y += 3;

  addSectionBar("CALIBRACION DINAMICA");
  t.para(O.dinamica, { s: 8 });
  t.pg(14);
  t.tr([100, 46, 46], ["VALORES INICIALES Equipo operando", "Menor", "Mayor"], 6.2, {
    fill: [m.GY, m.GY, m.GY],
    b: 1,
    left: [0],
    s: 9
  });
  [["Carga Inicial kg/U:", v.f_mink, v.f_maxk], ["Carga Inicial %:", v.f_minp, v.f_maxp]].forEach(row => {
    t.pg(6.2);
    t.tr([100, 46, 46], row, 6.2, { left: [0], s: 9 });
  });
  t.y += 3;

  addSectionBar("CONSTANTE DE ROTACION");
  t.para(O.rotacion, { s: 7.5 });
  addPfisterRow("Inicial:", v.f_ri);
  addPfisterRow("Final:", v.f_rf);
  t.y += 3;

  addSectionBar("AJUSTE DE CURVA ZERO");
  t.para(O.zero, { s: 7.5 });
  addPfisterRow("Valor Cero 1 %:", v.f_c1);
  addPfisterRow("Valor Cero 2 %:", v.f_c2);
  addPfisterRow("Valor Cero 3 %:", v.f_c3);
  t.y += 3;

  addSectionBar("VALORES FINALES EQUIPO OPERANDO", "Error %");
  t.para(O.final, { s: 7.5 });
  addPfisterRow("Error aceptable +-:", (v.f_tol || "") + " %");
  addPfisterRow("Carga Kg/U (0.00):", v.f_fk);
  addPfisterRow("Carga % (0,0):", v.f_fp, "", a.stp);

  t.photos(assets.photos);
  return t.blob();
}

// 6. Análisis de Seguridad en el Trabajo (AST) (a)
export function generateAstPdf({ v, assets }: { v: Record<string, any>; assets: any }) {
  const a = createPDFHelper({ landscape: true });
  const { X: t, W: r, D: n } = a;
  const colTheme = m.TL;

  a.logo(assets.logo);
  a.tx("ANÁLISIS DE SEGURIDAD EN EL TRABAJO", t + r / 2, a.y + 7, { s: 14, c: colTheme, a: "c" });
  a.tx("(AST)", t + r / 2, a.y + 12.5, { s: 14, c: colTheme, a: "c" });
  a.y += 17;

  n.setFillColor(...colTheme);
  n.rect(t, a.y, r, 0.8, "F");
  a.y += 3;

  const qW = r / 4;
  const tW = r / 3;
  const addLv = (lbl: string, val: any, x: number, width: number) => a.lv(lbl, val, x, width);

  addLv("Segmento:", v.a_seg, t, qW);
  addLv("Región:", v.a_reg, t + qW, qW);
  addLv("Unidad:", v.a_uni, t + 2 * qW, qW);
  addLv("Sitio:", v.a_sit, t + 3 * qW, qW);
  a.y += 7;

  addLv("Proceso:", v.a_pro, t, tW);
  addLv("Área:", v.a_are, t + tW, tW);
  addLv("FECHA:", v.fecha, t + 2 * tW, tW);
  a.y += 7;

  addLv("Equipo / Instalación:", v.a_equ, t, r / 2);
  addLv("Código HAC:", v.a_hac, t + r / 2, r / 2);
  a.y += 7;

  const descH = Math.max(10, a.sp(v.a_des, r - 64, 8).length * 3.6 + 3);
  a.cell(t, a.y, 60, descH, "DESCRIPCIÓN DE LA ACTIVIDAD A REALIZAR:", {
    f: m.GY,
    b: 1,
    s: 7.5,
    c: colTheme,
    a: "l"
  });
  a.cell(t + 60, a.y, r - 60, descH, v.a_des, { s: 8, a: "l", v: "t" });
  a.y += descH + 2;

  const astInstructions = [
    "- Se puede pre-llenar en digital y validarse en campo. Debe ser llenado en conjunto entre el responsable del área, el responsable del trabajo y los ejecutantes.",
    "- Desglosar los pasos de la actividad que va a realizar, indicando los peligros relacionados así como evaluando el nivel de riesgo.",
    "- Especificar los controles que serán implementados. Incluyendo controles de ingeniería o administrativos, no solo EPP.",
    '- SI EL NIVEL DE RIESGO ES "10" (O MAYOR) NO SE PUEDE INICIAR LA ACTIVIDAD Y SE DEBEN APLICAR CONTROLES ADICIONALES.- Durante la revisión / aprobación se pueden solicitar controles adicionales.'
  ];

  const instLines: string[] = [];
  astInstructions.forEach(txt => instLines.push(...a.sp(txt, r - 4, 7.5)));
  const instH = instLines.length * 3.1 + 8;
  n.setFillColor(0, 0, 0);
  n.rect(t, a.y, r, instH, "F");
  a.tx("Instrucciones:", t + r / 2, a.y + 4, { b: 1, s: 8.5, c: m.WH, a: "c" });
  a.tx(instLines, t + 2, a.y + 8, { s: 7.5, c: m.WH });
  a.y += instH + 2;

  const colWidths = [8, 55, 52, 62, 9, 9, 16, 44.4];
  const colHeaders = [
    "#",
    "Paso de la actividad",
    "Peligros",
    "Controles implementados (NO SOLO EPP)",
    "S",
    "P",
    "Riesgo (S*P)",
    "CONTROLES ADICIONALES"
  ];

  const colPositions: number[] = [];
  let curX = t;
  colWidths.forEach(w => {
    colPositions.push(curX);
    curX += w;
  });

  const printTableHeader = () =>
    a.tr(colWidths, colHeaders, 7, {
      fill: colWidths.map(() => colTheme),
      b: 1,
      s: 8,
      c: m.WH
    });

  printTableHeader();

  const activeSteps: number[] = [];
  const maxSteps = de(v);
  for (let sIdx = 0; sIdx < maxSteps; sIdx++) {
    if (
      v["a_pa" + sIdx] ||
      v["a_co" + sIdx] ||
      v["a_ad" + sIdx] ||
      (v["a_h" + sIdx] || []).length ||
      v[`a_s${sIdx}_0`] ||
      v[`a_q${sIdx}_0`] ||
      v[`a_s${sIdx}_1`]
    ) {
      activeSteps.push(sIdx);
    }
  }
  if (!activeSteps.length) activeSteps.push(0, 1, 2);

  activeSteps.forEach(sIdx => {
    const hazards = (v["a_h" + sIdx] || []).map((h: string) => "- " + h).join("\n");
    const stepData = [v["a_pa" + sIdx], hazards, v["a_co" + sIdx], v["a_ad" + sIdx]];
    const rowH = Math.max(
      14,
      a.h(
        [
          [stepData[0], 55, 8],
          [stepData[1], 52, 8],
          [stepData[2], 62, 8],
          [stepData[3], 44.4, 8]
        ],
        { lh: 3.3, pad: 3 }
      )
    );

    if (a.pg(rowH)) printTableHeader();

    const rowTop = a.y;
    colWidths.forEach((w, cIdx) => a.bx(colPositions[cIdx], rowTop, w, rowH));
    a.tx(String(sIdx + 1), colPositions[0] + colWidths[0] / 2, rowTop + 4.5, { a: "c", s: 8 });

    ([
      [1, stepData[0]],
      [2, stepData[1]],
      [3, stepData[2]],
      [7, stepData[3]]
    ] as const).forEach(([colI, text]) => {
      a.tx(a.sp(text, colWidths[colI] - 3, 8), colPositions[colI] + 1, rowTop + 4, { s: 8 });
    });

    [0, 1].forEach(evalIdx => {
      const risk = ve(v[`a_s${sIdx}_${evalIdx}`], v[`a_q${sIdx}_${evalIdx}`]);
      const subRowY = rowTop + (evalIdx * rowH) / 2;
      a.cell(colPositions[4], subRowY, 9, rowH / 2, v[`a_s${sIdx}_${evalIdx}`] || "", { s: 8 });
      a.cell(colPositions[5], subRowY, 9, rowH / 2, v[`a_q${sIdx}_${evalIdx}`] || "", { s: 8 });
      a.cell(
        colPositions[6],
        subRowY,
        16,
        rowH / 2,
        risk ? String(risk.v) : "",
        { f: risk && (m.RK as any)[risk.c], b: 1, s: 8 }
      );
    });

    a.y += rowH;
  });

  a.y += 3;
  if (a.y > 200) a.page();

  let legendX = t;
  ([
    ["G", "Aceptable", 38],
    ["Y", "Tolerable (Nivel 3)", 50],
    ["O", "No tolerable (Nivel 2)", 56],
    ["R", "Inaceptable (Nivel 1): paro inmediato", 80]
  ] as const).forEach(([key, label, width]) => {
    a.bx(legendX, a.y, 4, 4, (m.RK as any)[key]);
    a.tx(label, legendX + 6, a.y + 3.2, { s: 7.5 });
    legendX += width;
  });
  a.y += 9;

  const numWorkers = we(v);
  if (a.y + Math.max(14 * numWorkers + 13, 80) > 205) a.page();

  a.bar("PERSONAL INVOLUCRADO EN EL AST", colTheme, { h: 7, c: m.WH });
  a.y += 2;
  const sigTableTop = a.y;
  a.tr([16, 90, 56], ["Ejecutantes", "NOMBRE", "Firma"], 6, { g: 1, b: 1 });

  for (let wIdx = 0; wIdx < numWorkers; wIdx++) {
    const wY = a.y;
    a.cell(t, wY, 16, 14, String(wIdx + 1));
    a.cell(t + 16, wY, 90, 14, v["a_en" + wIdx], { a: "l" });
    a.bx(t + 106, wY, 56, 14);
    a.img(assets.sig["a_es" + wIdx], t + 106, wY, 56, 14);
    a.y += 14;
  }

  const rightX = t + 170;
  const rightW = r - 170;
  a.tx("El revisor y el autorizador deben ser personas distintas", rightX, sigTableTop - 1, { s: 7, b: 1 });

  let curRightY = sigTableTop + 2;
  ([
    ["Revisado por:", "a_rn", "a_rp", "a_rs"],
    ["Autorizado por:", "a_an", "a_ap", "a_as"]
  ] as const).forEach(([title, nameKey, roleKey, sigKey]) => {
    a.cell(rightX, curRightY, rightW, 6, title, { f: m.GY, b: 1, c: colTheme, a: "l", s: 8 });
    curRightY += 6;
    ([
      ["Nombre:", v[nameKey]],
      ["Puesto:", v[roleKey]]
    ] as const).forEach(([lbl, val]) => {
      a.cell(rightX, curRightY, 22, 6, lbl, { b: 1, c: colTheme, a: "l", s: 8 });
      a.cell(rightX + 22, curRightY, rightW - 22, 6, val, { a: "l", s: 8 });
      curRightY += 6;
    });
    a.cell(rightX, curRightY, 22, 16, "Firma:", { b: 1, c: colTheme, a: "l", s: 8 });
    a.bx(rightX + 22, curRightY, rightW - 22, 16);
    a.img(assets.sig[sigKey], rightX + 22, curRightY, rightW - 22, 16);
    curRightY += 20;
  });

  a.photos(assets.photos, colTheme, m.WH);
  return a.blob();
}

// 7 & 8. Precalentador (441-2K1 & 461-2K1) (h & i)
export function generatePrecalentadorPdf({ v, assets }: { v: Record<string, any>; assets: any }) {
  const eqKey = (v.fm || "h") as 'h' | 'i';
  const t = createPDFHelper();
  const { X: r, W: n } = t;

  t.logo(assets.logo);
  t.y += 18;
  t.bar("Inspeccion Analizadores Precalentador", m.BL, { s: 15, h: 10, a: "l", r: v.fecha || "-" });
  t.bar("EQUIPO:  " + (v[eqKey + "_eq"] || "-"), m.BL, { s: 9 });
  t.bar("INSPECTOR:  " + (v.insp || "-"), m.BL, { s: 9 });

  const descH = t.h([[xe, n, 9]], { lh: 4, pad: 2 });
  t.cell(r, t.y, n, descH, xe, { a: "l", v: "t" });
  t.y += descH;

  t.bar("INSPECCION SEMANAL", m.BL, { s: 9 });
  const stepColW = [110, 16, 66];
  t.tr(stepColW, ["Punto a Inspeccionar", "Status", "Observaciones:"], 6, { fill: [m.GY, m.GY, m.GY], s: 8.5 });

  Ie(v, eqKey).forEach(item => {
    const valText = item.v && v[`${eqKey}_v${item.i}`] ? v[`${eqKey}_v${item.i}`] : "";
    const obsText = [valText, v[`${eqKey}_o${item.i}`]].filter(Boolean).join("   ");
    const rowH = t.h([[item.t, 110, 8.5], [obsText, 66, 8.5]]);
    t.pg(rowH);
    t.tr(
      stepColW,
      [item.t, ({ ok: "OK", obs: "Obs" } as any)[v[`${eqKey}_s${item.i}`]] || "", obsText],
      rowH,
      {
        fill: [
          null,
          item.cs === "bad" ? m.ST.bad : m.CB,
          item.vs === "bad" ? m.ST.bad : m.CB
        ],
        left: [0, 2],
        s: 8.5
      }
    );
  });

  t.y += 2;
  t.bar("VERIFICACION CON GASES PATRON (MENSUAL)", m.BL, { s: 9 });
  const gasEval = ke(v, eqKey);
  t.bar("NO REALIZADO" + (gasEval.real ? "" : "      X"), m.BL, { s: 9 });
  t.bar("REALIZADO" + (gasEval.real ? "      X" : ""), m.BL, { s: 9 });

  if (gasEval.real) {
    const gasColW = [100, 36, 30, 26];
    const qe: Record<string, string> = { good: "Correcto", warn: "Precaución", bad: "Warning" };
    const veDict: Record<string, string> = { good: "Correcto", bad: "ERROR" };

    const addGasRow = (
      lbl: string,
      val1: any,
      val2: any,
      status: string,
      statusMap: Record<string, string>
    ) => {
      t.pg(6.2);
      t.tr(gasColW, [lbl, val1 != null ? val1 : "", val2 != null ? val2 : "", status ? statusMap[status] : ""], 6.2, {
        fill: [undefined, undefined, (m.ST as any)[status], (m.ST as any)[status]],
        left: [0],
        s: 9
      });
    };

    const formatPct = (num: number | null) => (num == null ? "" : g(num, 2) + " %");

    t.y += 2;
    addGasRow(
      "Realizar limpieza y sopleteo al cuarto de tanques.",
      ({ ok: "OK", obs: "Obs" } as any)[v[eqKey + "_lt"]] || "",
      "",
      v[eqKey + "_lt"] === "ok" ? "good" : v[eqKey + "_lt"] === "obs" ? "bad" : "",
      qe
    );

    t.tx(
      `Error aceptable: ± ${v[eqKey + "_tol"] || "-"} %   (error = (medido - referencia) / referencia x 100)`,
      r,
      t.y + 4,
      { s: 8 }
    );
    t.y += 7;

    V.forEach(gas => {
      const gItem = gasEval.g[gas.id];
      const gFlags = gItem.f;
      const prefix = `${eqKey}_g_${gas.id}_`;

      t.bar(gas.n + (gas.c ? "      " + gas.c + " " + (v[prefix + "c"] || "-") : ""), m.GM, { s: 9, a: "l" });
      addGasRow("Revisión presión total del cilindro (PSI)", v[prefix + "t"], "", gFlags.t, qe);

      if (gas.kind !== "p") {
        addGasRow("Revisión presión de salida del cilindro (2 BAR)", v[prefix + "s"], "", gFlags.s, qe);
        addGasRow("Fecha de caducidad del gas", v[prefix + "e"], "", gFlags.e, qe);
      }
      if (gas.kind === "ie") {
        addGasRow("Inicial", v[prefix + "ini"], formatPct(gItem.eI), gItem.sI, veDict);
        addGasRow("Final (Despues de calibracion)", v[prefix + "fin"], formatPct(gItem.eF), gItem.sF, veDict);
      }
      if (gas.kind === "zs") {
        addGasRow("ZERO", v[prefix + "z"], formatPct(gItem.eZ), gItem.sZ, veDict);
        addGasRow(`SPAN (${v[prefix + "sr"] || "-"})`, v[prefix + "sp"], formatPct(gItem.eS), gItem.sS, veDict);
      }
    });
  }

  t.photos(assets.photos);
  return t.blob();
}

export function generateReportPdf(v: Record<string, any>, assets: any): Blob {
  const fm = v.fm || "c";
  switch (fm) {
    case "c":
      return generateCemsPdf({ v, assets });
    case "p":
      return generatePesadorasPdf({ v, assets });
    case "g":
      return generateGasesPdf({ v, assets });
    case "e":
      return generateMotoresPdf({ v, assets });
    case "f":
      return generatePfisterPdf({ v, assets });
    case "a":
      return generateAstPdf({ v, assets });
    case "h":
    case "i":
      return generatePrecalentadorPdf({ v, assets });
    default:
      return generateCemsPdf({ v, assets });
  }
}
