import {
  K, oe, re, Y, J, B, se, he, Ta, Xe, q, ge, V, ie
} from '../constants/data';
import { StatusCounts } from '../types';

export const g = (e: number | null | undefined, o = 2): string =>
  e == null || Number.isNaN(e) ? "" : String(Number(e.toFixed(o)));

export const y = (e: Record<string, any>, o: string): number | null => {
  const val = e[o];
  const a = parseFloat(String(val != null ? val : "").replace(",", "."));
  return Number.isNaN(a) ? null : a;
};

export const Za: Record<string, number> = { "": -1, good: 0, warn: 1, bad: 2 };

export const Ea = (e: string[]): string =>
  e.reduce((o, a) => (Za[a] > Za[o] ? a : o), "");

export const Xa = (e: number | null | undefined): 'bad' | 'warn' | 'good' | '' =>
  e == null ? "" : e < 500 ? "bad" : e < 700 ? "warn" : "good";

export const Xt: Record<string, string> = {
  good: "Correcto",
  warn: "Precaución",
  bad: "Warning"
};

export function Ht(expiryDateStr: string, inspectionDateStr: string) {
  const a = (new Date(expiryDateStr).getTime() - new Date(inspectionDateStr).getTime()) / 864e5 / 30.44;
  return {
    m: a,
    st: a < 4 ? "bad" : a < 8 ? "warn" : "good",
    txt: a < 0 ? "gas caducado" : a < 4 ? "vigencia menor a 4 meses" : a < 8 ? "vigencia entre 4 y 8 meses" : ""
  };
}

export function ze(e: Record<string, any>, o: string, a?: number, t?: number) {
  const r = y(e, o + "_t");
  const n = y(e, o + "_s");
  const s = e[o + "_e"];
  const i: { t: string; s: string; e: string; why: string[]; full?: boolean } = { t: "", s: "", e: "", why: [] };

  if (r != null) {
    i.t = Xa(r);
    if (i.t === "bad") i.why.push("presión menor a 500 PSI");
    else if (i.t === "warn") i.why.push("presión entre 500 y 700 PSI");
  }

  if (a && n != null) {
    i.s = Math.abs(n - a) > 0.2 ? "bad" : "good";
    if (i.s === "bad") i.why.push("presión de salida fuera de rango");
  }

  if (t && s && e.fecha) {
    const l = Ht(s, e.fecha);
    i.e = l.st;
    if (l.txt) i.why.push(l.txt);
  }

  i.full = r != null && (!a || n != null) && (!t || !!s);
  return i;
}

export function Yt(e: Record<string, any>, o: string, a?: number, t?: number) {
  const r = ze(e, o, a, t);
  const n = Ea([r.t, r.s, r.e]);
  return {
    st: n === "warn" || n === "bad" ? n : r.full ? "good" : "",
    why: r.why.join(" · ")
  };
}

export interface CemsEvaluationItem {
  id: string;
  sec: string;
  t: string;
  days?: string[];
  ty?: 'ok' | 'n';
  st: string;
  why?: string;
}

export function Ae(e: Record<string, any>): CemsEvaluationItem[] {
  const o: CemsEvaluationItem[] = [];

  K.forEach((a, t) => {
    const r = Y.map((_, s) => e[`d${t}_${s}`]);
    o.push({
      id: "d" + t,
      sec: "Revisión diaria",
      t: a,
      days: r,
      st: r.includes("obs") ? "bad" : r.every(n => n === "ok") ? "good" : ""
    });
  });

  oe.forEach(([a, t, r, n, s]) => {
    let i = "";
    if (r === "ok") {
      i = e[a] === "ok" ? "good" : e[a] === "obs" ? "bad" : "";
    } else {
      const l = y(e, a);
      if (l != null) {
        i = (n != null && l < n) || (s != null && l > s) ? "bad" : "good";
      }
    }
    o.push({ id: a, sec: "Revisión semanal", t, ty: r, st: i });
  });

  re.forEach(([a, t, r, n, s]) => {
    const i = Yt(e, a, n, s);
    o.push({
      id: a,
      sec: "Gases",
      t: t + (r ? " · " + r : ""),
      st: i.st,
      why: i.why
    });
  });

  return o;
}

export const Ge = (e: { st?: string }[]): StatusCounts =>
  e.reduce(
    (o, a) => {
      const key = (a.st || "pending") as keyof StatusCounts;
      if (o[key] !== undefined) {
        o[key]++;
      }
      return o;
    },
    { good: 0, warn: 0, bad: 0, pending: 0 }
  );

export function Wa(e: Record<string, any>, o: string, a: number) {
  const t = (s: (number | null)[]) => {
    const i = s.filter((l): l is number => l != null);
    return i.length ? i.reduce((l, c) => l + c, 0) / i.length : null;
  };

  const r = [...Array(a)].map((_, i) => {
    const th = y(e, `p_${o}th_${i}`);
    const ta = y(e, `p_${o}ta_${i}`);
    const ne = y(e, `p_${o}ne_${i}`);
    const rg = y(e, `p_${o}rg_${i}`);
    return {
      th,
      ta,
      ne,
      rg,
      cm: ta != null && ne != null ? ta + ne : null,
      er: rg != null && ne != null ? rg - ne : null,
      pe: rg != null && ne ? ((rg - ne) / ne) * 100 : null
    };
  });

  const n: Record<string, number | null> = {};
  J.forEach(([s]) => {
    n[s] = t(r.map(i => i[s as keyof typeof i]));
  });

  return { cs: r, A: n };
}

export const Kt = (e: string, o: number) => {
  const [a, t, r] = e.split("-").map(Number);
  return new Date(Date.UTC(a, t - 1 + o, r)).toISOString().slice(0, 10);
};

export function Re(e: Record<string, any>) {
  const o = Wa(e, "a", 3);
  const a = Wa(e, "b", 1);
  const t = y(e, "p_k");
  const r = y(e, "p_tol");
  const n = a.A.pe;
  const s = o.A.pe;
  const i = y(e, "p_pvig");
  const l = e.p_fcal;
  const c = l && i != null && /^\d{4}-\d{2}-\d{2}$/.test(l) ? Kt(l, i) : null;

  return {
    a: o,
    b: a,
    pe: n,
    pa: s,
    tol: r,
    kf: o.A.ne != null && o.A.rg && t != null ? (o.A.ne / o.A.rg) * t : null,
    ok: n != null && r != null ? Math.abs(n) <= r : null,
    oka: s != null && r != null ? Math.abs(s) <= r : null,
    venc: c,
    vencido: !!(c && e.fecha && c < e.fecha)
  };
}

export const ee = (e: Record<string, any>, o: string) => {
  const a = y(e, "g_c_" + o);
  const t = y(e, "g_m_" + o);
  return a != null && t != null ? (t * a) / 22.4 : null;
};

export const Zt = (e: Record<string, any>, o: string) => {
  const map: Record<string, () => number | null> = {
    o2z: () => y(e, "g_c_o2"),
    o2s: () => y(e, "g_p_o2s"),
    tcz: () => 0,
    tcs: () => y(e, "g_c_c3"),
    so2: () => ee(e, "so2"),
    co: () => ee(e, "co"),
    no: () => ee(e, "no"),
    co2: () => y(e, "g_c_co2")
  };
  return map[o] ? map[o]() : null;
};

export function ce(e: Record<string, any>, o: string) {
  const a = Zt(e, o);
  const t = y(e, "g_r_" + o);
  const r = y(e, "g_tol");
  if (a == null || t == null) return { p: a, r: t, e: null, d: null, st: "" };
  if (a === 0) return { p: a, r: t, e: null, d: t - a, st: "" };
  const n = ((t - a) / a) * 100;
  return {
    p: a,
    r: t,
    e: n,
    d: null,
    st: r == null ? "" : Math.abs(n) <= r ? "good" : "bad"
  };
}

export const le = (e: Record<string, any>, o: string) => Xa(y(e, "g_ps_" + o));

export const Wt = (e: Record<string, any>) => {
  const o = y(e, "e_temp");
  return o == null ? null : Math.pow(0.5, (40 - o) / 10);
};

export function Oe(e: Record<string, any>) {
  const o = Wt(e);
  const a = q.map((_, idx) => y(e, "e_r_" + idx));
  const t = a.map(f => (f != null && o != null ? f * o : null));
  const r = y(e, "e_min");
  const n = y(e, "e_dd");
  const s = t[1];
  const i = a[1] != null && a[0] ? a[1] / a[0] : null;
  const l = t[10] != null && t[1] ? t[10] / t[1] : null;

  const c: [string, string] | null =
    s == null || r == null ? null : s * 1000 < r ? ["Resistencia baja", "bad"] : ["Bien", "good"];
  const d: [string, string] | null =
    i == null ? null : i < 1 ? ["Peligroso", "bad"] : i < 1.4 ? ["Cuestionable", "warn"] : i < 1.6 ? ["Bueno", "good"] : ["Excelente", "good"];
  const p: [string, string] | null =
    l == null ? null : l < 1 ? ["Peligroso", "bad"] : l < 2 ? ["Cuestionable", "warn"] : l < 4 ? ["Bueno", "good"] : ["Excelente", "good"];
  const u: [string, string] | null =
    n == null ? null : n < 2 ? ["Bueno", "good"] : n <= 4 ? ["Crítico", "warn"] : ["Malo", "bad"];

  return {
    kt: o,
    r: a,
    c: t,
    min: r,
    dd: n,
    ir: s,
    da: i,
    ip: l,
    d: [c, d, p, u],
    v: [s, i, l, n]
  };
}

export interface ChartCmd {
  k: "l" | "c" | "t";
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  c: string;
  w?: number;
  d?: string;
  r?: number;
  s?: number;
  t?: string;
  a?: "l" | "c" | "r";
  b?: number;
}

export function Be(e: ReturnType<typeof Oe>): ChartCmd[] {
  const o: ChartCmd[] = [];
  const s = q
    .map((b, $) => [b, e.r[$], e.c[$]] as [number, number | null, number | null])
    .filter((b): b is [number, number, number] => b[1] != null && b[2] != null);

  if (!s.length) {
    o.push({
      k: "t",
      x: 345,
      y: 150,
      s: 18,
      t: "Captura las lecturas y la temperatura para ver la gráfica",
      c: "mu",
      a: "c"
    });
    return o;
  }

  const i = Math.max(...s.map(b => Math.max(b[1], b[2])));
  const l = i / 5;
  const c = Math.pow(10, Math.floor(Math.log10(l || 1)));
  const d = l / c;
  const p = (d <= 1 ? 1 : d <= 2 ? 2 : d <= 5 ? 5 : 10) * c;
  const u = Math.ceil((i * 1.08) / p) * p;

  const f = (b: number) => 70 + (b / 10) * 550;
  const _ = (b: number) => 240 - (b / u) * 200;

  for (let b = 0; b <= u + p / 1000; b += p) {
    o.push(
      { k: "l", x1: 70, y1: _(b), x2: 620, y2: _(b), c: "grid", w: 1 },
      { k: "t", x: 62, y: _(b) + 5, s: 16, t: g(b, 2), c: "mu", a: "r" }
    );
  }

  for (let b = 0; b <= 10; b++) {
    o.push(
      { k: "l", x1: f(b), y1: 240, x2: f(b), y2: 245, c: "axis", w: 1 },
      { k: "t", x: f(b), y: 264, s: 16, t: String(b), c: "mu", a: "c" }
    );
  }

  [1, 10].forEach(b =>
    o.push({ k: "l", x1: f(b), y1: 40, x2: f(b), y2: 240, c: "hl", w: 1, d: "4 4" })
  );

  o.push(
    { k: "l", x1: 70, y1: 40, x2: 70, y2: 240, c: "axis", w: 1.5 },
    { k: "l", x1: 70, y1: 240, x2: 620, y2: 240, c: "axis", w: 1.5 },
    { k: "t", x: 690 / 2, y: 292, s: 17, t: "Tiempo (min)", c: "txt", a: "c" },
    { k: "t", x: 6, y: 26, s: 17, t: "GOhms", c: "txt", a: "l" }
  );

  ([[1, "s1", "6 5", 3], [2, "s2", undefined, 4.5]] as const).forEach(
    ([b, $, R, P]) => {
      for (let C = 1; C < s.length; C++) {
        o.push({
          k: "l",
          x1: f(s[C - 1][0]),
          y1: _(s[C - 1][b]),
          x2: f(s[C][0]),
          y2: _(s[C][b]),
          c: $,
          w: b === 2 ? 3 : 2,
          d: R
        });
      }
      s.forEach(C => o.push({ k: "c", x: f(C[0]), y: _(C[b]), r: P, c: $ }));
    }
  );

  s.filter(b => b[0] === 1 || b[0] === 10).forEach(b =>
    o.push(
      b[0] === 1
        ? { k: "t", x: f(1) + 10, y: _(b[2]) + 26, s: 17, t: b[2].toFixed(2), c: "s2", a: "l", b: 1 }
        : { k: "t", x: f(10) - 8, y: _(b[2]) - 12, s: 17, t: b[2].toFixed(2), c: "s2", a: "r", b: 1 }
    )
  );

  o.push(
    {
      k: "t",
      x: 100,
      y: 20,
      s: 17,
      t: `FA ${g(e.da, 2) || "-"}${e.d[1] ? " (" + e.d[1][0] + ")" : ""}  ·  IP ${g(e.ip, 2) || "-"}${e.d[2] ? " (" + e.d[2][0] + ")" : ""}`,
      c: "txt",
      a: "l",
      b: 1
    },
    { k: "l", x1: 335, y1: 34, x2: 360, y2: 34, c: "s1", w: 2, d: "6 5" },
    { k: "t", x: 366, y: 39, s: 15, t: "Medida", c: "mu", a: "l" },
    { k: "l", x1: 450, y1: 34, x2: 475, y2: 34, c: "s2", w: 3 },
    { k: "t", x: 481, y: 39, s: 15, t: "Corregida a 40 °C", c: "mu", a: "l" }
  );

  return o;
}

export function Pe(e: Record<string, any>) {
  const o = y(e, "f_nom");
  const a = y(e, "f_si");
  const t = ["f_s1", "f_s2", "f_s3"].map(d => y(e, d)).filter((d): d is number => d != null);
  const r = y(e, "f_tol");
  const n = y(e, "f_fp");
  const s = o && a != null ? 100 - (a * 100) / o : null;
  const i = o && t.length ? 100 - (t.reduce((d, p) => d + p, 0) / t.length) * 100 / o : null;
  const l = (d: number | null, p: string) => (d == null || r == null ? "" : Math.abs(d) <= r ? "good" : p);
  const c = (d: string[]) => {
    const p = d.map(u => y(e, u)).filter((u): u is number => u != null);
    return p.length > 1 ? Math.max(...p) - Math.min(...p) : null;
  };

  return {
    ei: s,
    ef: i,
    tol: r,
    sti: l(s, "warn"),
    stf: l(i, "bad"),
    stp: l(n, "bad"),
    repS: c(["f_s1", "f_s2", "f_s3"]),
    repC: c(["f_c1", "f_c2", "f_c3"])
  };
}

export function ve(e: any, o: any) {
  const seve = parseInt(e);
  const prob = parseInt(o);
  if (!(seve >= 1 && seve <= 5 && prob >= 1 && prob <= 5)) return null;
  const a = Ta[seve][prob - 1];
  return {
    v: seve * prob,
    c: a,
    n: Xe[a][0],
    k: Xe[a][1]
  };
}

export const de = (e: Record<string, any>) =>
  Math.min(15, Math.max(1, parseInt(e.a_n) || 5));

export const we = (e: Record<string, any>) =>
  Math.min(10, Math.max(1, parseInt(e.a_ne) || 3));

export function Ja(e: Record<string, any>) {
  let o = 0;
  let a = 0;
  let t = 0;
  const steps = de(e);
  for (let r = 0; r < steps; r++) {
    if (e["a_pa" + r]) t++;
    [0, 1].forEach(n => {
      const s = ve(e[`a_s${r}_${n}`], e[`a_q${r}_${n}`]);
      if (s && !n && s.v > o) o = s.v;
      if (s && s.v >= 10) a++;
    });
  }
  return { mx: o, bad: a, steps: t };
}

export const Qa = (e: Record<string, any>) => {
  const o = (e.a_rn || "").trim().toLowerCase();
  return !!o && o === (e.a_an || "").trim().toLowerCase();
};

export const je = (e: number | null, o: number | null) =>
  e == null || o == null || o === 0 ? null : ((e - o) / o) * 100;

export function Ie(e: Record<string, any>, o: 'h' | 'i') {
  return ie[o].steps.map((a, t) => {
    const r = e[`${o}_s${t}`];
    const n = r === "ok" ? "good" : r === "obs" ? "bad" : "";
    const s = a.v ? y(e, `${o}_v${t}`) : null;
    const i =
      a.v && a.v.max != null && s != null
        ? (a.v.strict ? s < a.v.max : s <= a.v.max)
          ? "good"
          : "bad"
        : "";
    return {
      i: t,
      t: a.t,
      v: a.v,
      cs: n,
      vs: i,
      st: n === "" ? "" : Ea([n, i])
    };
  });
}

export function ke(e: Record<string, any>, o: 'h' | 'i') {
  const a = y(e, o + "_tol");
  const t = (n: number | null) => (n == null || a == null ? "" : Math.abs(n) <= a ? "good" : "bad");
  const r: Record<string, any> = {};

  for (const n of V) {
    const s = `${o}_g_${n.id}`;
    const i = ze(e, s, n.kind === "p" ? 0 : 2, n.kind === "p" ? 0 : 1);
    const l: Record<string, any> = { f: i };
    const c = y(e, s + "_c");

    if (n.kind === "ie") {
      l.eI = je(y(e, s + "_ini"), c);
      l.eF = je(y(e, s + "_fin"), c);
      l.sI = t(l.eI);
      l.sF = t(l.eF);
    }
    if (n.kind === "zs") {
      l.eZ = je(y(e, s + "_z"), c);
      l.eS = je(y(e, s + "_sp"), y(e, s + "_sr"));
      l.sZ = t(l.eZ);
      l.sS = t(l.eS);
    }
    l.st = Ea([i.t, i.s, i.e, l.sI, l.sF, l.sZ, l.sS].filter(Boolean));
    r[n.id] = l;
  }

  return { tol: a, g: r, real: e[o + "_mreal"] === "si" };
}
