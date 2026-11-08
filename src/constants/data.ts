import { ReportTab } from '../types';

export const HOLCIM_LOGO = "data:image/png;base64,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";

export const Y = ["Lu", "Ma", "Mi", "Ju", "Vi"];

export const K = [
  "1.- Sistema de medición de Hidrogeno (H2): display en 0.0% LEL",
  "2.- Gabinete CEM’s ACF: solo LED verde encendido",
  "3. Aire acondicionado del cuarto y del gabinete funcionando",
  "4. Puerta del CEM’s bien cerrada",
  "5. Secador IDF6E (exterior trasero): encendido y temperatura entre 2 y 4 °C"
];

export const oe: [string, string, 'ok' | 'n', number?, number?][] = [
  ["w1", "1. Compresor encendido", "ok"],
  ["w2", "1.1 Presión de aire (5–6 Kg/cm2)", "n", 5, 6],
  ["w3", "1.2 Válvula de entrada abierta", "ok"],
  ["w4", "1.2 Sin tomas de aire ajenas", "ok"],
  ["w5", "1.2 Descarga de condensados", "ok"],
  ["w6", "1.2 Filtros del compresor sopleteados", "ok"],
  ["w7", "1.2 Horómetro (hrs)", "n"],
  ["x1", "2.1 Válvulas de entrada y salida de filtros abiertas", "ok"],
  ["x2", "2.1 Válvulas de bypass cerradas", "ok"],
  ["w8", "2.1 Indicador de humedad en verde (no amarillo)", "ok"],
  ["w9", "3.1 Temp. sonda Co.S (mín. 178 °C)", "n", 178, undefined],
  ["w10", "3.2 Temp. filtro Co.F (mín. 178 °C)", "n", 178, undefined],
  ["x3", "3.3 H2 en 0.0% LEL antes de abrir el gabinete", "ok"],
  ["w11", "3.3 LED verdes en tarjetas E/S", "ok"],
  ["w12", "3.4 Hub AU4: LED parpadeando (comunicación)", "ok"],
  ["x4", "3.4 Filtros del AU4 retirados y sopleteados", "ok"],
  ["w13", "3.5 Regulador J86 (1.2 bar)", "n", 1.1, 1.3],
  ["w14", "3.6 Regulador J88 (2 bar)", "n", 1.9, 2.1],
  ["w15", "3.7 Regulador J96 (4.5 bar)", "n", 4.4, 4.6],
  ["w16", "3.8 Regulador J85 (5.5 bar)", "n", 5.4, 5.6],
  ["w17", "3.9 Flujo B83 (200–220 l/h)", "n", 200, 220],
  ["x5", "Gabinete del CEM’s bien cerrado", "ok"],
  ["x6", "Limpieza y sopleteo del cuarto de tanques", "ok"],
  ["w18", "4.10 Purga del tanque A51RTN", "ok"]
];

export const re: [string, string, string, number, number][] = [
  ["co", "CO", "2418 umol/mol", 2, 1],
  ["no", "NO", "1806 umol/mol", 2, 1],
  ["so2", "SO2", "56.92 umol/mol", 2, 1],
  ["co2", "CO2", "24.02 cmol/mol", 2, 1],
  ["no2", "NO2", "73.3 umol/mol", 2, 1],
  ["h2", "Hidrógeno", "", 2, 0],
  ["o2", "Oxígeno", "2.001 cmol/mol", 2, 1],
  ["c3", "Propano", "15.97 umol/mol", 1.5, 1],
  ["n2", "Nitrógeno UAP", "", 0, 0]
];

export const Ze: Record<string, string> = {
  "1.": "1.-Suministro de aire externo al sistema (compresor GARDNER DENVER ENVIRO AIRE ES5)",
  "1.1": "1.1-Revisión presión de aire en manómetro",
  "1.2": "1.2-Revisión de alineamiento de válvula en tanque de aire",
  "2.1": "2.-Filtros de aire · 2.1-Indicador de humedad (Atlas Copco)",
  "3.1": "3.-Analizador ACF-NT · 3.1-Temperatura Sonda (Co.S)",
  "3.2": "3.2-Temperatura del Filtro (Co.F)",
  "3.3": "3.3-Status de tarjetas Entrada / Salida Analógicas",
  "3.4": "3.4-Status del Concentrador HuB-AU4",
  "3.5": "3.5-Regulador de presión – J86",
  "3.6": "3.6-Regulador de presión – J88",
  "3.7": "3.7-Regulador de presión – J96",
  "3.8": "3.8-Regulador de presión – J85",
  "3.9": "3.9-Flujo de salida de gases – B83",
  "4.10": "4.10-Purga del tanque de aire A51RTN"
};

export const J: [string, string, number][] = [
  ["th", "Registro pesadora (t/h)", 1],
  ["ta", "Camión c/ tara (kg)", 1],
  ["cm", "Camión c/ material (kg)", 0],
  ["ne", "Peso neto material (kg)", 1],
  ["rg", "Registro pesadora (kg)", 1],
  ["er", "Error (báscula − camión) (kg)", 0],
  ["pe", "% Error", 0]
];

export const wa: [string, string, string?][] = [
  ["p_hac", "Pesadora a verificar (HAC)"],
  ["p_area", "Área"],
  ["p_mat", "Material"],
  ["p_tur", "Turno"],
  ["p_marca", "Báscula marca"],
  ["p_k", "Valor Factor K", "d"],
  ["p_alt", "Altura de la cama de material"],
  ["p_cant", "Cantidad de material a pesar (kg)", "d"],
  ["p_fcal", "Fecha de calibración del patrón utilizado", "date"]
];

export const Ia: [string, string, string?][] = [
  ["p_desc", "Descripción del equipo"],
  ["p_modelo", "Modelo del equipo"],
  ["p_serie", "N° de serie"],
  ["p_res", "Resolución"],
  ["p_pdesc", "Patrón: descripción"],
  ["p_pmarca", "Patrón: marca"],
  ["p_pmodelo", "Patrón: modelo"],
  ["p_pcod", "Patrón: código"],
  ["p_pcal", "Calibrado por"],
  ["p_ptraz", "Trazabilidad"],
  ["p_pvig", "Vigencia del patrón (meses)", "d"],
  ["p_pinf", "Informe"]
];

export const ka: [string, string][] = [
  ["e_hac", "HAC"],
  ["e_pieza", "Pieza"],
  ["e_ubic", "Ubicación"],
  ["e_serie", "No. de serie"],
  ["e_pot", "Potencia"],
  ["e_rpm", "RPM"],
  ["e_volts", "Volts"],
  ["e_amp", "Ampers"],
  ["e_aisl", "Aisl. Cls."],
  ["e_marca", "Marca"],
  ["e_prueba", "Prueba realizada en"]
];

export const La = [
  "Resistencia de aislamiento al min. (GOhms, corregida a 40 °C)",
  "Factor de absorción (FA = R 1 min / R 0.5 min)",
  "Índice de polarización (IP = R 10 min / R 1 min)",
  "Ensayo de descarga dieléctrica (DD)"
];

export const q = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const ge = [
  "0.5 min", "1 min", "2 min", "3 min", "4 min",
  "5 min", "6 min", "7 min", "8 min", "9 min", "10 min"
];

export const B: [string, string][] = [
  ["o2", "O2"],
  ["toc", "TOC"],
  ["so2", "SO2"],
  ["co", "CO"],
  ["no", "NO"],
  ["co2", "CO2"]
];

export const se: [string, string, string, string][] = [
  ["o2z", "o2", "Zero", "%"],
  ["o2s", "o2", "Span", "%"],
  ["tcz", "toc", "Zero", "ppm"],
  ["tcs", "toc", "Span", "ppm"],
  ["so2", "so2", "Span", "mg/m³"],
  ["co", "co", "Span", "mg/m³"],
  ["no", "no", "Span", "mg/m³"],
  ["co2", "co2", "Span", "%"]
];

export const he: [string, string, string, number][] = [
  ["o2", "O2", "cmol/mol", 0],
  ["c3", "Propano (C3H8)", "umol/mol", 1],
  ["so2", "SO2", "umol/mol", 1],
  ["co", "CO", "umol/mol", 1],
  ["no", "NO", "umol/mol", 1],
  ["co2", "CO2", "cmol/mol", 0]
];

export const We: [string, string[]][] = [
  ["Biológico", [
    "Brote Epidémico",
    "Condiciones de higiene inadecuadas",
    "Estancamiento de agua",
    "Ingestión de alimentos mal preparados y/o contaminados",
    "Presencia de fauna nociva"
  ]],
  ["Eléctrico", [
    "Electricidad estática",
    "Energía eléctrica alta tensión (arriba de 35001 Volts)",
    "Energía eléctrica baja tensión (hasta 1000 Volts)",
    "Energía eléctrica media tensión (de 1001 a 35000 Volts)",
    "Herramientas eléctricas"
  ]],
  ["Ergonómicos", [
    "Manejo manual de carga",
    "Movimientos repetitivos",
    "Postura inadecuada"
  ]],
  ["Físico", [
    "Cargas suspendidas / levantamiento de cargas (con equipo)",
    "Condiciones climáticas extremas (altas o bajas)",
    "Cuerpos de agua (cisterna, laguna, zanja, alberca, fosa, tinaco, etc.)",
    "Descarga de unidades móviles con material a granel",
    "Emisiones / Presencia de partículas suspendidas",
    "Equipo y/o maquinaria que genera ruido",
    "Equipo y/o maquinaria que generan vibraciones",
    "Estructuras",
    "Falta de orden y limpieza",
    "Iluminación deficiente o excesiva",
    "Maquinaria y equipo en movimiento",
    "Material a granel apilado",
    "Materiales y/o herramientas manuales",
    "Objetos estacionarios",
    "Objetos punzocortantes",
    "Radiación ionizante",
    "Radiación no ionizante",
    "Recipientes sujetos a presión",
    "Sobrepresión de recipientes o unidades (silos, tolvas) de material a granel",
    "Subir y bajar escaleras",
    "Suelo resbaladizo o desigual",
    "Superficies calientes",
    "Temperaturas elevadas o abatidas",
    "Tiempo prolongado de almacenamiento / Sobreinventarios de sustancias químicas peligrosas o residuos",
    "Trabajo con riesgo de incendio (corte y soldadura)",
    "Trabajo en alturas",
    "Trabajos en espacios confinados",
    "Estibado / Almacenamiento inadecuado (tarimas dañadas, desnivelación, tambores plástico en tarima media)",
    "Vehículos en movimiento (Utilitarios/Montacargas/Cargadores/Pipas/Camiones de volteo etc.)"
  ]],
  ["Psicosociales", [
    "Intrusión a las instalaciones",
    "Lugares inseguros (Carreteras, calles, comunidades)",
    "Presencia de disturbios sociales (huelgas, manifestaciones, etc.)",
    "Situaciones psicosociales en el trabajo (Carga de trabajo excesiva, violencia física y psicológica, hostigamiento, mobbing)",
    "Zonas con grupos armados"
  ]],
  ["Químico", [
    "Manejo de residuos farmacéuticos",
    "Materiales combustibles",
    "Materiales inflamables",
    "Materiales químicos peligrosos o Residuos peligrosos",
    "Presencia de atmósfera explosiva"
  ]]
];

export const Ta = ["", "GGGYY", "GYYYO", "GYYOR", "YYORR", "YORRR"];

export const Xe: Record<string, [string, string]> = {
  G: ["Aceptable", "good"],
  Y: ["Tolerable", "warn"],
  O: ["No tolerable", "or"],
  R: ["Inaceptable", "bad"]
};

export const Ne: Record<string, string> = {
  p_desc: "BANDA PESADORA",
  p_pdesc: "Báscula Materia Primas",
  p_pmarca: "Revuelta",
  p_pmodelo: "ERCC",
  p_pcod: "30100-VBP/12.RTS/RAD560",
  p_pcal: "REVUELTA",
  p_ptraz: "CENAM",
  p_pvig: "6",
  p_pinf: "No. BRM-CC-60786/ 24 - No. BRM-CC-60787/ 24",
  p_tol: "1",
  g_c_o2: "2.014",
  g_c_c3: "15.97",
  g_m_c3: "44.1",
  g_c_so2: "56.92",
  g_m_so2: "64.06",
  g_c_co: "2395",
  g_m_co: "28.01",
  g_c_no: "1806",
  g_m_no: "30.01",
  g_c_co2: "24.02",
  g_p_o2s: "20.96",
  g_tol: "4",
  g_lin: "L1",
  g_ori: "v",
  e_vtest: "500",
  e_min: "100",
  e_dd: "0",
  e_o0: "Ninguna",
  e_o1: "Ninguna",
  e_o2: "Ninguna",
  e_o3: "Ninguna",
  e_nota: "Ninguna",
  f_tol: "0.1",
  a_n: "5",
  a_ne: "3"
};

export const ne: ReportTab[] = [
  { id: "c", tab: "Inspección CEM’s", title: "TC.421-2K1 Inspección Semanal", sub: "Mantenimiento preventivo CEM’s" },
  { id: "p", tab: "Pesadoras", title: "Pesada de material para bandas pesadoras", sub: "Verificación de banda pesadora · Planta Tecomán" },
  { id: "g", tab: "421-2K1 Verificacion con Gases Patron", title: "Verificación con gases patrón", sub: "TC421-2K1 · Verificación de CEM’s con gases patrón" },
  { id: "e", tab: "Pruebas Estaticas", title: "Pruebas estáticas a motores", sub: "Resistencia de aislamiento · Ref. IEEE 43-2000" },
  { id: "f", tab: "Dosificadores Pfister", title: "Dosificadores Pfister", sub: "Verificación de dosificadores · Zero y Span" },
  { id: "a", tab: "AST", title: "Análisis de Seguridad en el Trabajo (AST)", sub: "HSE-001-PN-002-FO02 · Rev. 01, Mar’25" },
  { id: "h", tab: "441-2K1 Inspección", title: "441-2K1 Inspección Analizadores Precalentador", sub: "Inspección semanal (1S) y verificación mensual con gases patrón (1M)" },
  { id: "i", tab: "461-2K1 Inspección", title: "461-2K1 Inspección Analizadores Precalentador", sub: "Inspección semanal (1S) y verificación mensual con gases patrón (1M)" }
];

export const ye: string[] = [
  ...Array.from({ length: 10 }, (_, i) => "a_es" + i),
  "a_rs",
  "a_as"
];

export const MAX_PHOTOS = 12;

export const Ma: [RegExp, number, number, string][] = [
  [/^e_temp$/, -40, 150, "°C"],
  [/_tol$/, 0, 100, "%"],
  [/^g_ps_/, 0, 6000, "PSI"],
  [/^[a-z0-9]+_t$/, 0, 6000, "PSI"],
  [/^[a-z0-9]+_s$/, 0, 20, "bar"],
  [/_g_[a-z0-9]+_t$/, 0, 6000, "PSI"],
  [/_g_[a-z0-9]+_s$/, 0, 20, "bar"],
  [/^e_r_\d+$/, 0, 100000, "GOhms"],
  [/^p_[ab](ta|ne|rg)_\d$/, 0, 1000000, "kg"],
  [/^e_dd$/, 0, 100, ""],
  [/^a_n$|^a_ne$/, 1, 15, ""]
];

export const Da: [string, string][] = [
  ["a_seg", "Segmento"],
  ["a_reg", "Región"],
  ["a_uni", "Unidad"],
  ["a_sit", "Sitio"],
  ["a_pro", "Proceso"],
  ["a_are", "Área"],
  ["a_equ", "Equipo / Instalación"],
  ["a_hac", "Código HAC"]
];

export const O = {
  muerta: `Con el dosificador vacío y parado, ejecute la rutina de compensación de carga muerta (La compensación de carga muerta fija el punto cero de la báscula).
Para ello seleccione nuevamente el menú 7-"CONFIGURACIÓN", entre al submenú 2-"BÁSC. ROTOR D.", en la opción "CALIBRACIÓN" pulsar la tecla "ENTER" y con las teclas del cursor descendente seleccione la instrucción "COMP. CARGA M.":`,
  antes: "Anote el valor de la carga registrada en el display ANTES de realizar el ajuste:",
  despuesM: "Anote el valor de la carga registrada en el display DESPUÉS de realizar el ajuste:",
  span: 'Coloque la pesas de prueba en el lugar correspondiente y con las teclas del cursor descendente seleccione la indicación "PESO DE PRUEBA", el valor registrado debe corresponder con el peso real del patrón. De no ser así modifique el valor pulsando la tecla "ENTER", introducir el valor de la pesa y finalmente pulse la tecla "ENTER". Con las teclas del cursor descendente seleccione la indicación "CALIBRAR o CALIBR. DEL SPAN".',
  despuesS: "Anote el valor de la carga registrada en el display DESPUES de realizar el ajuste ( los valores en las 3 verificaciones deben de dar una repetitibilidad de +/- 0.5 kg/U.):",
  retire: "Retire las pesas y verifique que la indicación de carga regresa a cero, si este no es el caso, existe un punto de contacto inadmisible entre el cuerpo de la báscula y el entorno que falsifica el resultado de pesaje, revise y corrija la desviación y ejecute nuevamente las rutinas de compensación de carga muerta y ajuste de span.",
  dinamica: "Ponga a trabajar el dosificador de manera local a una velocidad del 300 RPM.",
  rotacion: `Realice la rutina de "Constante de rotación", para ello seleccione el menú 7-"CONFIGURACIÓN",
entre al submenú 1-"PARA. SISTEMA" y con las teclas del cursor descendente seleccione la instrucción
"ROTATION CONSTANT". Para iniciar el cálculo del la constante de rotación pulse la tecla "CTRL. G`,
  zero: `Ejecute la rutina de ajuste de la Curva Zero, para ello seleccione nuevamente el menú
7-"CONFIGURACIÓN", entre al submenú 1-"PARA. SISTEMA" y con las teclas del cursor descendente
seleccione la instrucción "VALOR ZERO". Para iniciar el cálculo del punto Zero pulse la tecla "CTRL.
G", en la 1a línea aparece una indicación de marcha mientras se realiza dicho cálculo, al terminar
se visualiza el valor determinado. Anote dicho valor.

NOTA: EL VALOR DELVALOR ZERO NO DEBE DE EXCEDEREL10%, EN CASO CONTRARIO PROCEDA A REVISAR EL ACCIONAMIENTO DE LA CELDA DE CARGA.

nota: los valores en las 3 verificaciones deben de dar una repetitibilidad de +/- 0.2%:`,
  final: `Seleccione el menú 2-"INDICACION 1" y con las teclas de cursor seleccione la indicación de
carga en %. La lectura del instrumento debe ser igual o mantenerse muy cercana al cero. Si las
desviaciones del punto cero son mayores que 0.1- 0.2 % se debe calcular de nuevo el valor cero (o
la curva cero)`
};

export const xe = "Instrucciones: Realice semanalmente estas inspecciones en el analizador. Marque con un OK si la inspección esta sin anomalías, si existen anomalías escriba sus observaciones.";

export interface StepDef {
  t: string;
  v?: { l: string; max?: number; strict?: number };
}

const va = (texts: string[], overrides: Record<number, { l: string; max?: number; strict?: number }>): StepDef[] =>
  texts.map((t, idx) => (overrides[idx] ? { t, v: overrides[idx] } : { t }));

export const ie: Record<'h' | 'i', { eq: string; steps: StepDef[] }> = {
  h: {
    eq: "441-2K1",
    steps: va([
      "1.- Avisar a COP",
      '2.-Pasar selector a modo calibración "CAL"',
      "3.Apagar bomba",
      '4. Revisar y cambiar filtro de papel "oblea"',
      "5.Desconectar línea de muestreo (sonda) del filtro principal",
      "6. Limpieza de condensados y filtros",
      "7. Drenar agua de filtro de línea de aire de servicio y de limpieza",
      "8. Sacar filtro de piedra para limpieza",
      "9. Verificar O-rings",
      "10. Limpiar filtro calentado",
      "11. Destapar punto de muestreo",
      "12. Prender bomba y realizar limpieza; mover timer para activar la purga",
      "13. Meter aire a línea de sonda calentada desde donde está el filtro de piedra",
      "14. Colocar filtro de piedra",
      "15. Conectar línea de sonda al filtro principal",
      "16. Revisar timers de purga (1h / 1 min)",
      "17. Verificar flujo en rotámetro (65% del rango del rotámetro)",
      "18. Verificar valores de O₂, generalmente ≤ 5%",
      "19. Verificar valores de CO",
      "20. Verificar valores de NO",
      '21. Pasar selector a modo operación "OPE"',
      "22. Entregar a COP"
    ], {
      16: { l: "Flujo (% del rango)" },
      17: { l: "Valor O₂ (%)", max: 5 },
      18: { l: "Valor CO" },
      19: { l: "Valor NO" }
    })
  },
  i: {
    eq: "461-2K1",
    steps: va([
      "1.- Avisar COP",
      "2. Sacar sonda",
      '3. Limpiar filtros de papel "oblea"',
      "4. Limpiar filtro después de bomba de vacío (ABB)",
      "5. Limpiar condensados en filtro para gases",
      "6. Quitar seguro mecánico",
      "7. Quitar tapas laterales sonda",
      "8. Desconectar sonda calentada (Revisar O-rings, filtro para gas O2/NOx)",
      "9. Limpieza a punto de muestreo",
      "10. Limpieza a cuerpo de la sonda",
      "11. Verificar que no existan fugas en puntos de inserción",
      "12. Verificar anclaje (tuerca) del pistón de inserción",
      "13. Conectar sonda calentada",
      "14. Colocar tapas laterales",
      "15. Quitar seguro mecánico",
      "16. Limpiar intercambiador de calor (verificar funcionamiento)",
      "17. Limpiar y verificar ciclos de funcionamiento de bomba de recirculació",
      "18. Revisión nivel de agua tridestilada",
      "19. Limpiar filtro agua de enfriamiento",
      "20. Poner a trabajar analizador",
      "21. Anote valor de O2 (< 6%  ok)",
      "22. Anote valor de CO",
      "23. Anote valor de NO",
      "24. Entregar a COP"
    ], {
      20: { l: "Valor O₂ (%)", max: 6, strict: 1 },
      21: { l: "Valor CO" },
      22: { l: "Valor NO" }
    })
  }
};

export const V = [
  { id: "co", n: "4.1-GAS CO", c: "Concentración umol/mol:", cd: "2418", kind: "ie" },
  { id: "no", n: "4.2-GAS NO", c: "Concentración umol/mol:", cd: "1806", kind: "ie" },
  { id: "o2", n: "4.7-GAS OXIGENO", c: "Concentración zero umol/mol:", cd: "2.01", kind: "zs" },
  { id: "n2", n: "4.9-NITROGENO UAP", kind: "p" }
];

for (const e of ["h", "i"] as const) {
  Object.assign(Ne, {
    [e + "_eq"]: ie[e].eq,
    [e + "_tol"]: "4",
    [e + "_mreal"]: "no",
    [e + "_g_o2_sr"]: "20.96"
  });
  V.forEach(o => {
    if (o.cd) Ne[`${e}_g_${o.id}_c`] = o.cd;
  });
}
