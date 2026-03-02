import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Box, ScanLine, ChevronRight, AlertCircle,
  Layers, Truck, Loader2, Camera, X
} from 'lucide-react';

// ─── LISTADO DE SKUs POR NAVE ─────────────────────────────────────────────────
const SKU_POR_NAVE = {
  PL3: [
    { codigo: '9143A42K', descripcion: 'TV 43" Hisense FHD A42K' },
    { codigo: '9143UR8750PSA', descripcion: 'TV HISENSE 50" UHD 4K A6N' },
    { codigo: '9150A64N', descripcion: 'TV HISENSE 55" QLED Q6N' },
    { codigo: '9150C350NS', descripcion: 'TV HISENSE 65" QLED Q6N' },
    { codigo: '9150Q6N', descripcion: 'Smart TV LG 70" Ultra HD AI ThinQ 70UR8750PSA' },
    { codigo: '9155Q6N', descripcion: 'SMART TV 75" TOSHIBA - VIDAA TV' },
    { codigo: '9165Q6N', descripcion: 'AIRE ACOND. HISENSE SPLIT 2500W FRIO CALOR CL. A (U.E.)' },
    { codigo: '9175NANO80TSA', descripcion: 'AIRE ACOND. HISENSE SPLIT INVERTER BLACK 3300W FRIO CALOR CL. A (U.E.)' },
    { codigo: '9186NANO80TSA', descripcion: 'AIRE ACOND. HISENSE SPLIT 5000W FRIO CALOR CL. A (U.E.)' },
    { codigo: '91AS09HR4SYRKG00E', descripcion: 'AIRE ACOND. HISENSE SPLIT INVERTER BLACK 5500W FRIO CALOR CL. A++ (U.E.)' },
    { codigo: '91AS09HR4SYRKG00I', descripcion: 'AIRE ACOND. HISENSE SPLIT 6300W FRIO CALOR CL. A (U.E.)' },
    { codigo: '91AS12HR4SVRKG03PX4E', descripcion: 'AIRE ACOND. HISENSE SPLIT 8000W FRIO CALOR CL. A (U.E.)' },
    { codigo: '91AS12HR4SVRKG03PX4I', descripcion: 'ASADERA GENÉRICA' },
    { codigo: '91AS12UR4SVRCA02BKNE', descripcion: 'AIRE ACOND. NOBLEX SPLIT INVERTER 3550W FRIO CALOR CL. A++ (U.E.)' },
    { codigo: '91AS12UR4SVRCA02BKNI', descripcion: 'PAVA ELECTRICA CON CORTE SANSEI' },
    { codigo: '91AS18HR4SXSKG00PX4E', descripcion: 'SMART TV 40" PHILCO - VIDAA' },
    { codigo: '91AS18HR4SXSKG00PX4I', descripcion: 'AIRE ACOND. LG SPLIT INVERTER WIFI 3,5 KW FRIO CALOR (U.I.)' },
    { codigo: '91AS18UR4SXSCA00BKNE', descripcion: 'AIRE ACOND. LG SPLIT INVERTER WIFI 5 KW FRIO CALOR (U.I.)' },
    { codigo: '91AS18UR4SXSCA00BKNI', descripcion: 'AIRE ACOND. LG SPLIT INVERTER WIFI 6 KW FRIO CALOR (U.I.)' },
    { codigo: '91AS18UR4SXSCD00PX4E', descripcion: 'FREIDORA DE AIRE CON VISOR NEGRA 6 LITROS' },
    { codigo: '91AS18UR4SXSCD00PX4I', descripcion: 'Freezer Vertical SIAM 65 litros FSI-CV065B' },
    { codigo: '91AS22HR4SXTKG00E', descripcion: 'Generador Electrico 2500W' },
    { codigo: '91AS22HR4SXTKG00I', descripcion: 'Horno grill 70 litros' },
    { codigo: '91ASGEN2', descripcion: 'HORNO DE PAN ATMA NEGRO' },
    { codigo: '91DB55X3500', descripcion: 'HELADERA BAJO MESADA 123 LITROS ( NEGRA)' },
    { codigo: '91DR32X7080', descripcion: 'LAVAVAJILLA HISENSE INOX 14 CUBIERTOS' },
    { codigo: '91DR55X8580', descripcion: 'Juguera negra PHILCO' },
    { codigo: '91DR55X8800', descripcion: 'LAVAVAJILLAS 5 CUBIERTOS - ATMA - NEGRO' },
    { codigo: '91DV32X7080', descripcion: 'microondas Atma Digital C/ grill Black 23 Membrana' },
    { codigo: '91DV50X8580', descripcion: 'BICICLETA MTB ACERO 29 FIERCE F210 21VEL GRIS TALLE 18' },
    { codigo: '91DV65X8580', descripcion: 'MOPA CENTRIFUGA CON RUEDAS Y PEDAL PROLINE' },
    { codigo: '91DV75X8580', descripcion: 'Microondas Philco Digital blanco 20 lts' },
    { codigo: '91NXIN35HA3BNE', descripcion: 'CALEFÓN PHILCO 14/L MIN - BLANCO - TIRO FORZADO - TECNOLOGÍA PILOTLESS' },
    { codigo: '91NXIN35HA3BNI', descripcion: 'Cava termoeléctrica 12 botellas PHILCO PHCAV012N' },
    { codigo: '91NXS32HA4CNE', descripcion: 'AIRE ACOND. PHILCO SPLIT INVERTER 8750 FRIO CALOR CL. A (U.E.) // CON WIFI' },
    { codigo: '91NXS32HA4CNI', descripcion: 'LAVARROPA CARGA FRONTAL INVERTER 11KG 1400 RPM PHILCO PHLF1114BI' },
    { codigo: '91NXS50HA4CNE', descripcion: 'Lavarropas carga frontal 6,5kg PHILCO - Blanco PHLF6510B2' },
    { codigo: '91NXS50HA4CNI', descripcion: 'TORRE DE LAVADO CARGA FRONTAL LAVARROPAS + LAVASECARROPA PHILCO DARK GRAY' },
    { codigo: '91PHBKS26HA6ANE', descripcion: 'HELADERA TOP MOUNT NO FROST 267L BRUTO CON DISPENSER PHILCO - PHNT267XD2' },
    { codigo: '91PHBKS26HA6ANI', descripcion: 'HELADERA SIDE BY SIDE 428L NETA NEGRA PHILCO - PHSB450N' },
    { codigo: '91PHBKS34HA6ANE', descripcion: 'HELADERA SBS CROSSDOOR 385L NETOS CON DISPENSER + INVERTER INOX PHILCO - PHSB470XD2' },
    { codigo: '91PHBKS34HA6ANI', descripcion: 'HELADERA SINGLE DOOR 161 LITROS CON DISPENSER PHILCO PHSD179BD2 BLANCO' },
    { codigo: '91PHIN35HA3BNE', descripcion: 'termotanque eléctrico 2000w 30 litros blanco' },
    { codigo: '91PHIN35HA3BNI', descripcion: 'termotanque eléctrico philco 2000w blanco 50 litros' },
    { codigo: '91PHS32HA4CNE', descripcion: 'termotanque eléctrico philco 1500w blanco 80 litros' },
    { codigo: '91PHS50HA4CNE', descripcion: 'HELADERA SINGLE DOOR HISENSE BLANCA 179 L' },
    { codigo: '91PHS50HA4CNI', descripcion: 'HELADERA HISENSE TOP MOUNT NO FROST INOX INVERTER DISPENSER 375L' },
    { codigo: '91PHS60HA4CNE', descripcion: 'INODORO SMART SANSEI MIZU BLANCO' },
    { codigo: '91PHS60HA4CNI', descripcion: 'AIRE ACOND. SIAM PISO TECHO 6TR FRIO CALOR (U.E.)' },
    { codigo: '91PHW25CA3AN', descripcion: 'VENTILADOR DE TECHO 56"' },
    { codigo: '91PHW32CA3AN', descripcion: 'Tostadora Blanca ATMA' },
    { codigo: '91PLD40HS24', descripcion: 'TORRE DE SONIDO PHILCO' },
    { codigo: '91PLD50US25GH', descripcion: 'Sistema de Audio Vertical' },
    { codigo: '91PLD55US25GH', descripcion: 'Termotanque eléctrico SIAM 35lts TSI-TS035BM BLANCO' },
    { codigo: '91PLD55US25VH', descripcion: 'Termotanque eléctrico SIAM 65lts TSI-TS065BM BLANCO' },
    { codigo: '91S4NW12JA31A', descripcion: 'LAVARROPAS INVERTER LG BLANCO WM10WVC4S6 CON AI DD y THINQ 10KG 1400 RPM' },
    { codigo: '91S4NW12JARPA', descripcion: 'ZRAY KAYAK 1 PERSONA' },
    { codigo: '91S4NW18KL31A', descripcion: 'INDOOR UNIT MULTIV CASSETTE 4 WAY 36 KBTU' },
    { codigo: '91S4NW18KLRPA', descripcion: 'CAFETERA DE FILTRO 0,6 L' },
    { codigo: '91S4NW24K231E', descripcion: 'FREEZER HORIZONTAL HISENSE 297L' },
    { codigo: '91S4NW24K2RPE', descripcion: 'CAJA ORGANIZADORA ATMA HOME' },
    { codigo: '91S4UW12JA31A', descripcion: 'Parlante Portátil Bluetooth Full Led' },
    { codigo: '91S4UW12JARPA', descripcion: 'Freezer Vertical SIAM 181 litros FSI-CV181B' },
    { codigo: '91S4UW18KL31A', descripcion: 'FREEZER VERTICAL HISENSE BLANCO 82L' },
    { codigo: '91S4UW18KLRPA', descripcion: 'GUANTE DE BOXEO 10 OZ ROJO' },
    { codigo: '91S4UW24K231E', descripcion: 'GUANTE DE BOXEO 12 OZ ROJO' },
    { codigo: '91S4UW24K2RPE', descripcion: 'GUANTE ARTES MARCIALES TALLE M NEGRO' },
    { codigo: '91SAS25HA4CNE', descripcion: 'VENDA DE BOXEO 4 METROS NEGRO' },
    { codigo: '91SAS25HA4CNI', descripcion: 'ALETA DE NATACION ROSA 36-37' },
    { codigo: '91TDS2550UIGH', descripcion: 'HORNO GRILL AIR FRYER ATMA 17 LITROS' },
    { codigo: '91WBJ12B', descripcion: 'HELADERA BAJO MESADA 83L PLATA SIAM - HSI-BM093P2' },
    { codigo: '91WBM12B', descripcion: 'HELADERA BAJO MESADA 50L CORAL - SIAM RETRO HSI-BM50BR2' },
    { codigo: '9250A64N', descripcion: 'Exhibidora vertical SIAM 65 litros HSI-EV065B2' },
    { codigo: '92AS12UR4SVRCA02BKNE', descripcion: 'LAVAVAJILLAS 15 CUBIERTOS INOX' },
    { codigo: '92AS12UR4SVRCA02BKNI', descripcion: 'Microondas Philco Digital blanco 23 lts' },
    { codigo: '92AS18UR4SXSCA00BKNE', descripcion: 'Soporte Movil Marca Philco Serie G' },
    { codigo: '92AS18UR4SXSCA00BKNI', descripcion: 'Cava termoeléctrica de vinos 28 Botellas PHILCO PHCAV028N' },
    { codigo: '92AS18UR4SXSCD00PX4E', descripcion: 'Cava eléctrica con compresor 52 Botellas PHILCO PHCAV052N' },
    { codigo: '92AS18UR4SXSCD00PX4I', descripcion: 'FREEZER POZO BLANCO PHILCO - PHCH144B' },
    { codigo: '92AS22HR4SXTKG00E', descripcion: 'Freezer de pozo 400 L PHCH410BM' },
    { codigo: '92AS22HR4SXTKG00I', descripcion: 'Freezer de pozo 520 L PHCH535BM' },
    { codigo: '92FR246AWP', descripcion: 'PILETA ESTRUCTURAL REDONDA PLUS CON PATRÓN RATÁN 6765 L' },
    { codigo: '92FR259PHP', descripcion: 'HELADERA COMBI NO FROST 339 L INOX PHILCO - PHNC382XT' },
    { codigo: '92FR60MAWP', descripcion: 'AIRE ACONDICIONADO PHILCO PORTATIL 2650 W F/C' },
    { codigo: '92FR901DP', descripcion: 'AIRE ACONDICIONADO PHILCO PORTATIL 3500 W F/C' },
    { codigo: '92HFR582DP', descripcion: 'HELADERA HISENSE TOP MOUNT NO FROST INVERTER INOX 320L' },
    { codigo: '92HGFAB1725PI', descripcion: 'Lavasecarropa Hisense Carga Frontal 10/6kg Inverter' },
    { codigo: '92PHCA14B', descripcion: 'CAVA TERMOELECTRICA 8 BOTELLAS PHILCO - PHCAV08N2' },
    { codigo: '92PHCS07B', descripcion: 'HELADERA COMBI NO FROST INVERTER 374L INOX PHILCO - PHNC417XI' },
    { codigo: '92PHCS10B', descripcion: 'HELADERA SIDE BY SIDE 450L INOX - PHSB450X' },
    { codigo: '92PHCT225B', descripcion: 'Heladera SBS Hisense Black Glass 564 litros' },
    { codigo: '92PHCT242X', descripcion: 'Heladera Cross Door Hisense Inverter + Smart Screen 640 litros' },
    { codigo: '92PHCV065B', descripcion: 'Freezer Vertical Hisense Plata 169 litros' },
    { codigo: '92PHIN35HA3BNE', descripcion: 'HELADERA HISENSE TOP MOUNT NO FROST INVERTER INOX DISPENSER 461L' },
  ],
  PL2: [
    { codigo: '9132LQ630BPSA', descripcion: 'Smart TV LG 32" Full HD AI ThinQ 32LQ630BPSA' },
    { codigo: '9155QNED80SRA', descripcion: 'SMART TV LG NANOCELL 86" ULTRA HD AI THINQ 86NANO80TSA' },
    { codigo: '9170UR8750PSA', descripcion: 'AIRE ACOND. HISENSE SPLIT 3200W FRIO CALOR CL. A (U.E.)' },
    { codigo: '9175C450NS', descripcion: 'AIRE ACOND. HISENSE SPLIT 3400W FRIO CALOR CL. A (U.I.)' },
    { codigo: '91AS12UR4SVRCD02NE', descripcion: 'AIRE ACOND. PHILCO BLACK SPLIT 2560W FRIO CALOR CL. A (U.E.)' },
    { codigo: '91AS12UR4SVRCD02NI', descripcion: 'AIRE ACOND. PHILCO SPLIT 6000W FRIO CALOR CL. A (U.E.)' },
    { codigo: '91AS18UR4SXSCA00EPI', descripcion: 'AIRE ACONDICIONADO SANSEI SPLIT 2750 W F/C (U.E.)' },
    { codigo: '91AS18UR4SXSCA00IPI', descripcion: 'EXPRIMIDOR DE JUGO ATMA' },
    { codigo: '91AS30HR4SBBTG00E', descripcion: 'Horno grill 90 litros' },
    { codigo: '91AS30HR4SBBTG00I', descripcion: 'Hidrolavadora 1100W' },
    { codigo: '91DV43X7180', descripcion: 'MICROONDAS LG INVERTIR 42 LITROS NEO CHEFF NEGRO ESPEJADO' },
    { codigo: '91MT5000', descripcion: 'Aspiradora Philco Tacho 18L' },
    { codigo: '91NXS25HA4CNE', descripcion: 'Lavarropas carga superior GRIS PHILCO PHCS07B' },
    { codigo: '91NXS25HA4CNI', descripcion: 'Heladera Cíclica Top Mount Blanca PHILCO PHCT225B' },
    { codigo: '91OLED65C3PSA', descripcion: 'HELADERA TOP MOUNT NO FROST 198L BRUTO PHILCO - PHNT198X2' },
    { codigo: '91PE1821BP', descripcion: 'HELADERA TOP MOUNT NO FROST 281L NETA CON DISPENSER PHILCO -PHNT267BD2' },
    { codigo: '91PHS32HA4CNI', descripcion: 'Plancha Seca PHILCO' },
    { codigo: '91S4NW24K23AE', descripcion: 'CALEFÓN A GAS INVERTER 14 L/MIN TIRO FORZADO SIAM BLANCO' },
    { codigo: '91S4UW24K23AE', descripcion: 'GUANTE DE BOXEO 14 OZ ROJO' },
    { codigo: '91SAS32HA4CNE', descripcion: 'PELOTA DE FUTBOL NUMERO 5 BLANCA' },
    { codigo: '91SAS32HA4CNI', descripcion: 'HORNO GRILL ATMA 35 LITROS CON ANAFE' },
    { codigo: '91WBA12A', descripcion: 'LAVAVAJILLA HISENSE 13 CUBIERTOS GRIS' },
    { codigo: '91WBB12A', descripcion: 'HELADERA BAJO MESADA 90L CORAL HSI-BM090BR2 - SIAM RETRO' },
    { codigo: '9250Q6N', descripcion: 'Exhibidora vertical SIAM 115 litros HSI-EV115B2' },
    { codigo: '9255US660H0SD', descripcion: 'Exhibidora vertical SIAM 229 litros Blanca HSI-EV229B2' },
    { codigo: '92ATH-LI010-FRPRF', descripcion: 'COCINA A GAS, 50CM, PHILCO, BLANCO' },
    { codigo: '92ATH-LI018-FRPRF', descripcion: 'Heladera Ciclica Inox 260 L - Codigo Homa: DF2-34' },
    { codigo: '92EXAT23IP', descripcion: 'Freezer vertical PHILCO 180 litros Blanco' },
    { codigo: '92FR246ABP', descripcion: 'EXHIBIDORA VERTICAL PHEV400B2 - PHILCO' },
    { codigo: '92FR248ABP', descripcion: 'LAVAVAJILLA 12 CUBIERTOS PHILCO BLANCO' },
    { codigo: '92FR248AWP', descripcion: 'LAVASECARROPAS CARGA FRONTAL 12KG GREY SILVER' },
    { codigo: '92FR256PHP', descripcion: 'HELADERA COMBI NO FROST 299L NETA PHILCO - PHNC304P' },
    { codigo: '92FR60ARBP', descripcion: 'HELADERA TOP MOUNT NO FROST DISPENSER + INVERTER 324L NETA PHILCO - PHNT324BDI' },
    { codigo: '92FR60ARWP', descripcion: 'HELADERA TOP MOUNT NO FROST INVERTER 502L NETA PHILCO - PHNT504XI' },
    { codigo: '92FSI-CV065B', descripcion: 'SECARROPAS BLANCO PHILCO 3,5KG' },
    { codigo: '92GE-PH2500ALP', descripcion: 'HELADERA SIDE BY SIDE 555LTS BLANCA CON DISPLAY PHSB555BT' },
    { codigo: '92H06AFBK1S1', descripcion: 'termotanque eléctrico philco 2000w blanco 100 litros' },
    { codigo: '92H09AFBK2S5', descripcion: 'HELADERA SIDE BY SIDE NEGRA 468L' },
    { codigo: '92H09AFBKS4S', descripcion: 'HELADERA HISENSE CÍCLICA TOP MOUNT GRIS 240L' },
    { codigo: '92HG7022P', descripcion: 'SECADOR DE PELO REVLON' },
    { codigo: '92HG9022P', descripcion: 'BARRA DE SONIDO LG SQC1 - 160W 2.1' },
    { codigo: '92HGFA1724UAP', descripcion: 'LAVASECARROPAS INVERTER LG SILVER CARGA FRONTAL WD90VVC4S6 CON AIDD, STEAM, ECO HYBRID DRY Y THINQ 9KG / 5KG 1200 RPM' },
    { codigo: '92HI1101P', descripcion: 'LAVARROPAS 8KG 3S BLANCO SMART INVERTER' },
    { codigo: '92HPAT24BP', descripcion: 'WAFLERA MICKEY NEGRA' },
    { codigo: '92HRBF125B', descripcion: 'LAVARROPA HISENSE 9,5 KG CARGA SUPERIOR' },
    { codigo: '92HS642D90X', descripcion: 'LAVARROPAS HISENSE 6KG TITANIUM CARGA SUPERIOR' },
    { codigo: '92JUPH21BP', descripcion: 'AIRE ACOND. NOBLEX SPLIT INVERTER 5200W FRIO CALOR CL. A++ (U.E.)' },
    { codigo: '92LLJ05N', descripcion: 'AIRE ACOND. LG SPLIT INVERTER 3,5 KW FRIO CALOR (U.I.)' },
    { codigo: '92MATDGB23UAP', descripcion: 'GAZEBO PHILCO 3X3 AZUL CON 3 PAREDES' },
    { codigo: '92MH8298DIR-PI', descripcion: 'Horno grill 50 litros c Convección' },
    { codigo: '92MMFIF210GRISP', descripcion: 'HORNO GRILL 60 LITROS' },
    { codigo: '92MMFIF210NEGP', descripcion: 'HORNO GRILL 15 LTS CON AIR FRYER - NEGRO' },
    { codigo: '92MMPHFUNCELP', descripcion: 'HELADERA CÍCLICA SINGLE DOOR 164L NETA CON DISPENSER PHILCO - PHSD170XD' },
    { codigo: '92MMSHULTAZUP', descripcion: 'Freezer Vertical HISENSE 166 litros RS-20DCS (PLATA)' },
    { codigo: '92MMSHULTNEGP', descripcion: 'HELADERA HISENSE BLANCA TOP MOUNT INVERTER 250 LITROS' },
    { codigo: '92MPCHLVA01PI', descripcion: 'AIRE ACOND. WHIRLPOOL SPLIT INVERTER 3000 FRIO CALOR CL. A (U.I.)' },
    { codigo: '92MPHDW20UAP', descripcion: 'CLIMATIZADOR DE AIRE PORTATIL PHILCO FRIO 6 LITROS' },
    { codigo: '92MPHRW20UAP', descripcion: 'FREEZER VERTICAL 151L NETO NEGRO SIAM - FSI-CV181N' },
    { codigo: '92MT5000', descripcion: 'GENERADOR 6.5KVA' },
    { codigo: '92PEAT1351WP', descripcion: 'Licuadora de vaso roja' },
    { codigo: '92PHAST1821PI', descripcion: 'LAVARROPAS SEMIAUTOMATICO 5KG BLANCO SIAM - LSI-SS05B' },
    { codigo: '92PHBKS26HA6ANE', descripcion: 'HELADERA BAJO MESADA 93L BLANCA PHILCO - PHBM093B2' },
    { codigo: '92PHBKS26HA6ANI', descripcion: 'CAVA TERMOELECTRICA 18 BOTELLAS PHILCO - PHCAV018N2' },
    { codigo: '92PHCAV012N', descripcion: 'HELADERA PHILCO 269LTS COMBI PLATA PHCC269P' },
  ],
};

// ─── CONFIGURACIÓN DE SUPABASE ───────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ─── COMPONENTES UI REUTILIZABLES ────────────────────────────────────────────

const Button = ({ children, variant = 'primary', onClick, className = '', type = 'button', disabled = false }) => {
  const style = variant === 'primary'
    ? { backgroundColor: '#0099A8', color: 'white' }
    : { backgroundColor: 'white', color: '#0099A8', border: '2px solid #0099A8' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`w-full py-4 px-6 rounded-[16px] font-bold text-center transition-all active:scale-95 flex items-center justify-center gap-2 text-base ${disabled ? 'opacity-50' : ''} ${className}`}
      style={style}>
      {children}
    </button>
  );
};

const InputGroup = ({ label, id, type = 'text', value, onChange, placeholder, inputMode, icon: Icon, suffix, error, rightElement }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-1">{label}</label>
    <div className="relative flex gap-2">
      <div className="relative flex-1">
        {Icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icon size={20} /></div>}
        <input type={type} id={id} name={id} value={value} onChange={onChange} placeholder={placeholder} inputMode={inputMode}
          className={`w-full bg-gray-50 border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'} text-gray-800 text-lg rounded-[12px] focus:ring-2 focus:ring-[#0099A8] focus:border-transparent outline-none py-3 ${Icon ? 'pl-12' : 'pl-4'} ${suffix ? 'pr-12' : 'pr-4'}`}
        />
        {suffix && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">{suffix}</div>}
      </div>
      {rightElement}
    </div>
    {error && <p className="text-red-500 text-[9px] mt-1 font-bold">{error}</p>}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[20px] shadow-sm border border-gray-100 p-5 ${className}`}>{children}</div>
);

const Header = ({ title }) => (
  <header className="bg-white sticky top-0 z-50 px-6 py-4 shadow-sm flex justify-between items-center">
    <h1 className="text-[20px] font-bold text-gray-800">{title}</h1>
    <img src="/logo.png" alt="OCASA" className="h-8 w-auto" />
  </header>
);

// ─── COMPONENTE: ESCÁNER DE BARCODE ──────────────────────────────────────────

const BarcodeScanner = ({ onDetected, onClose }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!mounted) return;

        const scanner = new Html5Qrcode('barcode-reader');
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 280, height: 150 }, aspectRatio: 1.5 },
          (decodedText) => {
            scanner.stop().then(() => {
              if (mounted) onDetected(decodedText);
            }).catch(() => {});
          },
          () => {}
        );
      } catch (err) {
        if (mounted) setError('No se pudo acceder a la cámara. Verificá los permisos.');
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black/80">
        <p className="text-white font-bold">Escaneá el código de barras</p>
        <button onClick={onClose} className="text-white p-2"><X size={24} /></button>
      </div>
      <div className="flex-1 flex items-center justify-center bg-black">
        {error ? (
          <div className="text-center p-6">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <p className="text-white mb-4">{error}</p>
            <Button variant="secondary" onClick={onClose}>Cerrar</Button>
          </div>
        ) : (
          <div id="barcode-reader" ref={scannerRef} className="w-full max-w-sm" />
        )}
      </div>
      <div className="p-4 bg-black/80 text-center">
        <p className="text-gray-400 text-xs">Apuntá al código EAN / barcode del producto</p>
      </div>
    </div>
  );
};

// ─── COMPONENTE: CAPTURA DE FOTO ─────────────────────────────────────────────

const PhotoCapture = ({ photo, onCapture, onRemove }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800;
        let { width, height } = img;
        if (width > height && width > MAX_SIZE) {
          height = (height * MAX_SIZE) / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width = (width * MAX_SIZE) / height;
          height = MAX_SIZE;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          onCapture(blob, URL.createObjectURL(blob));
        }, 'image/jpeg', 0.7);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-4">
      <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-2">Foto del Producto</label>
      {photo ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <img src={photo.preview} alt="Producto" className="w-full h-48 object-cover" />
          <button onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg">
            <X size={16} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => fileInputRef.current?.click()}
          className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 active:bg-gray-50 transition-all">
          <Camera size={32} />
          <span className="text-sm font-bold">Tomar foto o elegir imagen</span>
        </button>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
        onChange={handleFileChange} className="hidden" />
    </div>
  );
};

// ─── FORMULARIO DE SKU ───────────────────────────────────────────────────────

const SKUForm = ({ initialSku, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    sku: initialSku || '', descripcion: '', nave: 'PL2',
    largo: '', ancho: '', alto: '', peso: '',
    max_apilado: '', se_palletiza: false, unidades_pallet: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Al cambiar la nave, limpiar el SKU seleccionado
  const handleNaveChange = (nave) => {
    setFormData((prev) => ({ ...prev, nave, sku: '', descripcion: '' }));
  };

  // Al seleccionar un SKU del desplegable, auto-completar la descripción
  const handleSkuChange = (e) => {
    const codigo = e.target.value;
    const item = SKU_POR_NAVE[formData.nave]?.find(s => s.codigo === codigo);
    setFormData((prev) => ({
      ...prev,
      sku: codigo,
      descripcion: item ? item.descripcion : '',
    }));
  };

  const handlePhotoCapture = (blob, preview) => {
    setPhoto({ blob, preview });
  };

  const uploadPhoto = async (sku) => {
    if (!photo || !supabase) return null;
    const fileName = `${sku}_${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from('sku-fotos')
      .upload(fileName, photo.blob, { contentType: 'image/jpeg' });

    if (error) {
      console.error('Error subiendo foto:', error);
      return null;
    }

    const { data } = supabase.storage.from('sku-fotos').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      alert('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
      return;
    }

    setLoading(true);
    setErrors({});

    if (!formData.sku || !formData.descripcion || !formData.max_apilado) {
      setErrors({ form: 'Seleccioná un SKU y completá el campo Apilado.' });
      setLoading(false);
      return;
    }

    const { data: existing } = await supabase
      .from('maestro_sku')
      .select('id')
      .eq('sku', formData.sku)
      .eq('nave', formData.nave)
      .maybeSingle();

    if (existing) {
      setErrors({ sku: `El SKU ${formData.sku} ya existe en ${formData.nave}` });
      setLoading(false);
      return;
    }

    const fotoUrl = await uploadPhoto(formData.sku);

    const { error } = await supabase.from('maestro_sku').insert([{
      sku: formData.sku,
      descripcion: formData.descripcion,
      nave: formData.nave,
      largo_cm: parseFloat(formData.largo) || 0,
      ancho_cm: parseFloat(formData.ancho) || 0,
      alto_cm: parseFloat(formData.alto) || 0,
      peso_kg: parseFloat(formData.peso) || 0,
      max_apilado: parseInt(formData.max_apilado) || 0,
      unidades_por_pallet: formData.se_palletiza ? parseInt(formData.unidades_pallet) : null,
      foto_url: fotoUrl,
    }]);

    if (error) {
      setErrors({ form: 'Error al guardar: ' + error.message });
      setLoading(false);
    } else {
      onSave();
    }
  };

  return (
    <div className="min-h-screen bg-[#efefff] pb-24 font-verdana">
      <Header title="Registro Parasum" />

      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* ── Datos principales ── */}
        <Card>
          {/* Selector de Nave */}
          <div className="mb-4">
            <label className="block text-[9px] font-bold text-gray-500 mb-2 uppercase">Nave</label>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['PL2', 'PL3'].map((n) => (
                <button key={n} type="button" onClick={() => handleNaveChange(n)}
                  className={`flex-1 py-3 rounded-[10px] text-sm font-bold transition-all ${
                    formData.nave === n ? 'bg-[#0099A8] text-white shadow-md' : 'text-gray-500'
                  }`}>{n}</button>
              ))}
            </div>
          </div>

          {/* Desplegable de SKU filtrado por nave */}
          <div className="mb-4">
            <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-1">Código SKU</label>
            <select
              value={formData.sku}
              onChange={handleSkuChange}
              className={`w-full bg-gray-50 border ${errors.sku ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'} text-gray-800 text-base rounded-[12px] focus:ring-2 focus:ring-[#0099A8] focus:border-transparent outline-none py-3 px-4 appearance-none`}
            >
              <option value="">— Seleccioná un SKU —</option>
              {(SKU_POR_NAVE[formData.nave] || []).map((item) => (
                <option key={item.codigo} value={item.codigo}>
                  {item.codigo} — {item.descripcion}
                </option>
              ))}
            </select>
            {errors.sku && <p className="text-red-500 text-[9px] mt-1 font-bold">{errors.sku}</p>}
          </div>

          {/* Descripción auto-completada (solo lectura) */}
          {formData.descripcion && (
            <div className="mb-4 bg-gray-100 rounded-[12px] px-4 py-3">
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-1">Descripción</p>
              <p className="text-sm text-gray-800 font-medium">{formData.descripcion}</p>
            </div>
          )}
        </Card>

        {/* ── Foto del producto ── */}
        <Card>
          <PhotoCapture
            photo={photo}
            onCapture={handlePhotoCapture}
            onRemove={() => setPhoto(null)}
          />
        </Card>

        {/* ── Dimensiones ── */}
        <Card>
          <div className="grid grid-cols-3 gap-3">
            <InputGroup label="Largo" id="largo" type="number" value={formData.largo} onChange={handleChange} suffix="cm" />
            <InputGroup label="Ancho" id="ancho" type="number" value={formData.ancho} onChange={handleChange} suffix="cm" />
            <InputGroup label="Alto" id="alto" type="number" value={formData.alto} onChange={handleChange} suffix="cm" />
          </div>
          <InputGroup label="Peso Bruto" id="peso" type="number" value={formData.peso} onChange={handleChange} suffix="kg" icon={Box} />
        </Card>

        {/* ── Almacenamiento ── */}
        <Card>
          <InputGroup label="Niveles de Apilado" id="max_apilado" type="number" value={formData.max_apilado} onChange={handleChange} icon={Layers} />

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <label className="text-sm font-bold text-gray-700">¿Se palletiza?</label>
            <div
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.se_palletiza ? 'bg-[#0099A8]' : 'bg-gray-300'}`}
              onClick={() => setFormData({ ...formData, se_palletiza: !formData.se_palletiza })}>
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${formData.se_palletiza ? 'translate-x-6' : ''}`} />
            </div>
          </div>

          {formData.se_palletiza && (
            <div className="mt-4">
              <InputGroup label="Unid. por Pallet" id="unidades_pallet" type="number" value={formData.unidades_pallet} onChange={handleChange} icon={Truck} />
            </div>
          )}
        </Card>

        {/* ── Error global ── */}
        {errors.form && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl">
            <AlertCircle size={18} />
            {errors.form}
          </div>
        )}

        {/* ── Botones ── */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} className="flex-1">Cancelar</Button>
          <Button type="submit" disabled={loading} className="flex-[2]">
            {loading ? <Loader2 className="animate-spin" /> : 'Guardar SKU'}
          </Button>
        </div>
      </form>
    </div>
  );
};

// ─── APP PRINCIPAL ───────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState('dashboard');
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('maestro_sku')
      .select('*')
      .order('fecha_registro', { ascending: false })
      .limit(10);
    if (data) setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (view === 'form') {
    return (
      <SKUForm
        onSave={() => { setView('dashboard'); fetchHistory(); }}
        onCancel={() => setView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#efefff] font-verdana">
      <Header title="Parasum Digital" />

      <main className="px-4 py-6 max-w-md mx-auto">
        {/* Contadores por nave */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="!bg-[#056572] text-white border-none shadow-lg">
            <span className="text-[9px] uppercase font-bold opacity-70">Depósito PL2</span>
            <p className="text-2xl font-bold">{history.filter(i => i.nave === 'PL2').length} SKUs</p>
          </Card>
          <Card className="!bg-[#0099A8] text-white border-none shadow-lg">
            <span className="text-[9px] uppercase font-bold opacity-70">Depósito PL3</span>
            <p className="text-2xl font-bold">{history.filter(i => i.nave === 'PL3').length} SKUs</p>
          </Card>
        </div>

        {/* CTA principal */}
        <button onClick={() => setView('form')}
          className="w-full bg-gradient-to-r from-[#0099A8] to-[#056572] text-white py-8 rounded-[24px] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all mb-8">
          <ScanLine size={32} />
          <div className="text-left">
            <p className="text-xl font-bold">Nuevo Registro</p>
            <p className="text-xs opacity-80 font-normal">Escaneo o Manual</p>
          </div>
          <ChevronRight className="ml-auto mr-4" />
        </button>

        {/* Últimos registros */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Últimos Registros</h2>
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-center text-gray-400 text-xs py-4">Sin registros todavía</p>
          ) : (
            history.map((item, i) => (
              <Card key={item.id || i} className="flex items-center gap-4 py-3">
                {item.foto_url ? (
                  <img src={item.foto_url} alt={item.sku} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="bg-gray-100 p-2 rounded-lg text-[#0099A8]"><Box size={24} /></div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-sm">{item.sku}</p>
                    <span className="text-[9px] font-bold bg-blue-50 text-[#0099A8] px-2 rounded-full">{item.nave}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">{item.descripcion}</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
