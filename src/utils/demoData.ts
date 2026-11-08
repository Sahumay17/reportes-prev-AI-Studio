import { ReportType } from '../types';
import { K, Y, oe } from '../constants/data';

export function getDemoData(tab: ReportType): Record<string, any> {
  const base: Record<string, any> = {};

  switch (tab) {
    case 'c': {
      Object.assign(base, {
        fecha: "2026-10-22",
        insp: "Ing. Roberto Salazar",
        co_t: "1100",
        co_s: "2",
        co_e: "2028-08-04",
        no_t: "1500",
        no_s: "2",
        no_e: "2027-07-22",
        so2_t: "1100",
        so2_s: "2",
        so2_e: "2027-01-08",
        co2_t: "800",
        co2_s: "2",
        co2_e: "2027-10-19",
        no2_t: "1900",
        no2_s: "2",
        no2_e: "2027-10-08",
        h2_t: "1250",
        h2_s: "2",
        o2_t: "1250",
        o2_s: "2",
        o2_e: "2028-07-21",
        c3_t: "1750",
        c3_s: "1.5",
        c3_e: "2028-07-26",
        n2_t: "1500",
        w2: "6.0",
        w7: "10118.8",
        w9: "180",
        w10: "180",
        w13: "1.2",
        w14: "2.0",
        w15: "4.5",
        w16: "5.5",
        w17: "220"
      });
      K.forEach((_, dailyIdx) =>
        Y.forEach((_, dayIdx) => (base[`d${dailyIdx}_${dayIdx}`] = "ok"))
      );
      oe.forEach(([id, , type]) => {
        if (type === "ok") base[id] = "ok";
      });
      break;
    }

    case 'p': {
      Object.assign(base, {
        fecha: "2026-10-24",
        insp: "Carlos Mendoza",
        p_hac: "532-BP3",
        p_area: "Cemento L2",
        p_mat: "Clinker",
        p_tur: "2",
        p_marca: "Tersus",
        p_k: "1.0208",
        p_alt: "22 cm",
        p_cant: "10000",
        p_fcal: "2026-02-10",
        p_modelo: "INTECONT +",
        p_serie: "110227381-60A-CNTRL",
        p_res: "0,01 t/h",
        p_acc: "ver",
        p_ath_0: "126.43",
        p_ath_1: "126.64",
        p_ath_2: "126.24",
        p_ata_0: "17210",
        p_ata_1: "17210",
        p_ata_2: "17200",
        p_ane_0: "9780",
        p_ane_1: "9790",
        p_ane_2: "9800",
        p_arg_0: "10006",
        p_arg_1: "10001",
        p_arg_2: "10000",
        p_bth_0: "127.83",
        p_bta_0: "17200",
        p_bne_0: "10030",
        p_brg_0: "10000",
        p_obs: "ABW -2.35%.\nCW: 314.16.   KOR 1.0208\n50% de Salida",
        p_aut: "Ing. Manuel Fuentes"
      });
      break;
    }

    case 'g': {
      Object.assign(base, {
        fecha: "2026-10-19",
        insp: "Alejandro Morales",
        g_lin: "L1",
        g_tol: "4",
        g_r_o2z: "2.01",
        g_r_o2s: "20.96",
        g_r_tcz: "0.12",
        g_r_tcs: "15.8",
        g_r_so2: "149.8",
        g_r_co: "3045",
        g_r_no: "2498",
        g_r_co2: "26.03",
        g_ps_o2: "1900",
        g_ps_toc: "580",
        g_ps_so2: "1780",
        g_ps_co: "800",
        g_adz: "1",
        g_ads: "1",
        g_obs: "Verificación mensual satisfactoria. Se realizó ajuste ligero en Span O2."
      });
      break;
    }

    case 'e': {
      const readings = [4.72, 8.53, 13.85, 17.51, 18.25, 25.6, 23.9, 24.3, 22.5, 23.4, 23.5];
      Object.assign(base, {
        fecha: "2026-05-25",
        insp: "Miguel Ángel López",
        e_hac: "TC.541MP2",
        e_pieza: "Motor C.A.",
        e_ubic: "Cemento L1",
        e_serie: "1234",
        e_pot: "600 W",
        e_rpm: "1787",
        e_volts: "460",
        e_amp: "703",
        e_aisl: "F",
        e_marca: "WH",
        e_prueba: "Variador",
        e_temp: "32",
        e_vtest: "500",
        e_l12: "103.2",
        e_l13: "102.1",
        e_l23: "102.8",
        e_na: "22",
        e_nf: "102",
        e_dd: "0",
        e_o0: "Resistencia aceptable superior a 100 MOhms",
        e_o1: "Factor de absorción excelente (> 1.6)",
        e_o2: "Índice de polarización excelente (> 2.0)",
        e_o3: "Descarga dieléctrica sin novedades",
        e_nota: "Motor en óptimas condiciones de aislamiento para operación continua."
      });
      readings.forEach((val, idx) => {
        base["e_r_" + idx] = String(val);
      });
      break;
    }

    case 'f': {
      Object.assign(base, {
        fecha: "2026-11-05",
        insp: "Guillermo Rivas",
        f_hac: "531-DO1",
        f_mod: "AX123",
        f_rk: "0",
        f_rp: "0",
        f_z1: "60",
        f_z2: "6.6",
        f_z3: "0",
        f_z4: "0",
        f_nom: "208.17",
        f_si: "206.9",
        f_s1: "208.2",
        f_s2: "208.19",
        f_s3: "208.2",
        f_mink: "-15",
        f_maxk: "1",
        f_minp: "-1.5",
        f_maxp: "0.1",
        f_ri: "64511",
        f_rf: "64525",
        f_c1: "-0.8",
        f_c2: "-0.8",
        f_c3: "-0.8",
        f_fk: "0",
        f_fp: "0",
        f_tol: "0.1"
      });
      break;
    }

    case 'a': {
      Object.assign(base, {
        fecha: "2026-11-04",
        a_seg: "Cemento",
        a_reg: "México",
        a_uni: "Planta",
        a_sit: "Tecomán",
        a_pro: "Mantenimiento",
        a_are: "Eléctrico",
        a_equ: "Motor 531-MT1",
        a_hac: "531-MT1",
        a_des: "Cambio de motor eléctrico principal en banda transportadora",
        a_n: "2",
        a_ne: "2",
        a_pa0: "Bloqueo y etiquetado (LOTO)",
        a_h0: [
          "Energía eléctrica media tensión (de 1001 a 35000 Volts)",
          "Trabajo en alturas"
        ],
        a_co0: "LOTO candado y tarjeta, verificación de ausencia de tensión, permiso de trabajo en alturas con arnés",
        a_s0_0: "4",
        a_q0_0: "3",
        a_ad0: "Supervisor eléctrico en sitio, doble verificación de corte de energía",
        a_s0_1: "3",
        a_q0_1: "2",
        a_pa1: "Retiro del motor con grúa móvil",
        a_h1: ["Cargas suspendidas / levantamiento de cargas (con equipo)"],
        a_co1: "Maniobra dirigida por rigger calificado, delimitación de área con cinta perimetral",
        a_s1_0: "3",
        a_q1_0: "2",
        a_en0: "Juan Pérez García",
        a_en1: "Luis Gómez Hernández",
        a_rn: "Ing. Ana Ruiz Martínez",
        a_rp: "Supervisor de Seguridad Industrial",
        a_an: "Ing. Carlos Soto Vega",
        a_ap: "Gerente de Mantenimiento"
      });
      break;
    }

    case 'h':
    case 'i': {
      const eq = tab === 'h' ? '441-2K1' : '461-2K1';
      Object.assign(base, {
        fecha: "2026-11-07",
        insp: "Javier Cárdenas",
        [tab + "_eq"]: eq,
        [tab + "_mreal"]: "si",
        [tab + "_lt"]: "ok",
        [tab + "_tol"]: "4",
        [tab + "_g_co_t"]: "1100",
        [tab + "_g_co_s"]: "2",
        [tab + "_g_co_e"]: "2028-08-04",
        [tab + "_g_co_ini"]: "2546",
        [tab + "_g_co_fin"]: "2418",
        [tab + "_g_no_t"]: "1500",
        [tab + "_g_no_s"]: "2",
        [tab + "_g_no_e"]: "2027-07-22",
        [tab + "_g_no_ini"]: "1917",
        [tab + "_g_no_fin"]: "1806",
        [tab + "_g_o2_t"]: "250",
        [tab + "_g_o2_s"]: "2",
        [tab + "_g_o2_e"]: "2028-07-21",
        [tab + "_g_o2_z"]: "2.01",
        [tab + "_g_o2_sp"]: "20.96",
        [tab + "_g_n2_t"]: "1500"
      });

      const numSteps = tab === 'h' ? 22 : 24;
      for (let s = 0; s < numSteps; s++) {
        base[`${tab}_s${s}`] = "ok";
      }

      if (tab === 'h') {
        base["h_v16"] = "65";
        base["h_v17"] = "4.8";
        base["h_v18"] = "335";
        base["h_v19"] = "618";
        base["h_o7"] = "Filtro de piedra fue limpiado satisfactoriamente";
      } else {
        base["i_v20"] = "5.3";
        base["i_v21"] = "345";
        base["i_v22"] = "518";
      }
      break;
    }
  }

  return base;
}
