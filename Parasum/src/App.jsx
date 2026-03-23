import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Box, ScanLine, ChevronRight, AlertCircle,
  Layers, Truck, Loader2, Camera, X
} from 'lucide-react';

// ─── LISTADO DE SKUs POR NAVE ─────────────────────────────────────────────────
// Fuente: SKU PARASUM.xlsx (actualizado 2026-03-23)
const SKU_POR_NAVE = {
  PL3: [
    { codigo: '9143A42K', descripcion: 'TV 43" Hisense FHD A42K', localizador: 'A05.000.000 / A19.000.000' },
    { codigo: '9150A64N', descripcion: 'TV HISENSE 50" UHD 4K A6N', localizador: 'A09.000.000 / B05.000.000 / B16.000.000 / B18.000.000 / REC.000.000' },
    { codigo: '9155Q6N', descripcion: 'TV HISENSE 55" QLED Q6N', localizador: 'A03.000.000 / B06.000.000' },
    { codigo: '9165Q6N', descripcion: 'TV HISENSE 65" QLED Q6N', localizador: 'A07.000.000' },
    { codigo: '91AS09HR4SYRKG00E', descripcion: 'AIRE ACOND. HISENSE SPLIT 2500W FRIO CALOR CL. A (U.E.)', localizador: 'B06.000.000 / B16.000.000' },
    { codigo: '91AS12UR4SVRCA02BKNE', descripcion: 'AIRE ACOND. HISENSE SPLIT INVERTER BLACK 3300W FRIO CALOR CL. A (U.E.)', localizador: 'A02.000.000 / B06.000.000' },
    { codigo: '91AS18HR4SXSKG00PX4E', descripcion: 'AIRE ACOND. HISENSE SPLIT 5000W FRIO CALOR CL. A (U.E.)', localizador: 'A16.000.000 / B06.000.000 / B17.000.000' },
    { codigo: '91AS18UR4SXSCA00BKNE', descripcion: 'AIRE ACOND. HISENSE SPLIT INVERTER BLACK 5500W FRIO CALOR CL. A++ (U.E.)', localizador: 'B06.000.000 / B09.000.000' },
    { codigo: '91AS22HR4SXTKG00E', descripcion: 'AIRE ACOND. HISENSE SPLIT 6300W FRIO CALOR CL. A (U.E.)', localizador: 'B06.000.000 / B07.000.000' },
    { codigo: '91ASGEN2', descripcion: 'ASADERA GENÉRICA', localizador: 'B10.000.000' },
    { codigo: '91NXIN35HA3BNE', descripcion: 'AIRE ACOND. NOBLEX SPLIT INVERTER 3550W FRIO CALOR CL. A++ (U.E.)', localizador: 'B07.000.000' },
    { codigo: '91PLD40HS24', descripcion: 'SMART TV 40" PHILCO - VIDAA', localizador: 'B18.000.000' },
    { codigo: '91S4NW12JA31A', descripcion: 'AIRE ACOND. LG SPLIT INVERTER WIFI 3,5 KW FRIO CALOR (U.I.)', localizador: 'A17.000.000 / B06.000.000 / B18.000.000' },
    { codigo: '91S4NW18KL31A', descripcion: 'AIRE ACOND. LG SPLIT INVERTER WIFI 5 KW FRIO CALOR (U.I.)', localizador: 'A16.000.000 / B06.000.000 / B08.000.000' },
    { codigo: '91S4NW24K231E', descripcion: 'AIRE ACOND. LG SPLIT INVERTER WIFI 6 KW FRIO CALOR (U.I.)', localizador: 'B06.000.000 / B07.000.000' },
    { codigo: '94FR246ABP', descripcion: 'FREIDORA DE AIRE CON VISOR NEGRA 6 LITROS', localizador: 'A07.000.000 / ANA.LIS.IS' },
    { codigo: '94FSI-CV065B', descripcion: 'Freezer Vertical SIAM 65 litros FSI-CV065B', localizador: 'A09.000.000 / PL4.000.000' },
    { codigo: '94HRBF125B', descripcion: 'HELADERA BAJO MESADA 123 LITROS ( NEGRA)', localizador: 'A16.000.000' },
    { codigo: '92PHCA14B', descripcion: 'CALEFÓN PHILCO 14/L MIN - BLANCO - TIRO FORZADO - TECNOLOGÍA PILOTLESS', localizador: 'B06.000.000' },
    { codigo: '94PHCAV012N', descripcion: 'Cava termoeléctrica 12 botellas PHILCO PHCAV012N', localizador: 'A09.000.000 / B11.000.000 / CAL.000.000' },
    { codigo: '92PHLF6510B2', descripcion: 'Lavarropas carga frontal 6,5kg PHILCO - Blanco PHLF6510B2', localizador: 'A14.000.000 / B06.000.000 / SIN.000.000' },
    { codigo: '92PHSB470XD2', descripcion: 'HELADERA SBS CROSSDOOR 385L NETOS CON DISPENSER + INVERTER INOX PHILCO - PHSB470XD2', localizador: 'B06.000.000' },
    { codigo: '94PHSD179BD2', descripcion: 'HELADERA SINGLE DOOR 161 LITROS CON DISPENSER PHILCO PHSD179BD2 BLANCO', localizador: 'B18.000.000 / REC.000.000' },
    { codigo: '92PHTE050B2', descripcion: 'termotanque eléctrico philco 2000w blanco 50 litros', localizador: 'B06.000.000' },
    { codigo: '92PHTE080B2', descripcion: 'termotanque eléctrico philco 1500w blanco 80 litros', localizador: 'B06.000.000 / B10.000.000' },
    { codigo: '92RL230WW4AU', descripcion: 'HELADERA SINGLE DOOR HISENSE BLANCA 179 L', localizador: 'B06.000.000 / B07.000.000 / SCR.OCA.SA' },
    { codigo: '94RT3N375NMC', descripcion: 'HELADERA HISENSE TOP MOUNT NO FROST INOX INVERTER DISPENSER 375L', localizador: 'A08.000.000 / A11.000.000 / A12.000.000 / A16.000.000 / A17.000.000 / B09.000.000 / SIN.000.000' },
    { codigo: '94TO20WP', descripcion: 'Tostadora Blanca ATMA', localizador: 'A07.000.000 / A08.000.000 / CAL.000.000' },
    { codigo: '92WM10WVC4S6', descripcion: 'LAVARROPAS INVERTER LG BLANCO WM10WVC4S6 CON AI DD¿ Y THINQ 10KG 1400 RPM', localizador: 'A16.000.000 / ANA.LIS.IS / B06.000.000 / B16.000.000' },
    { codigo: '94CF3N297NEW', descripcion: 'FREEZER HORIZONTAL HISENSE 297L', localizador: 'A17.000.000 / A18.000.000 / B12.000.000' },
    { codigo: '94FSI-CV181B', descripcion: 'Freezer Vertical SIAM 181 litros FSI-CV181B', localizador: 'A18.000.000 / B11.000.000' },
    { codigo: '94HGFA1724UAP', descripcion: 'HORNO GRILL AIR FRYER ATMA 17 LITROS', localizador: 'A08.000.000 / B07.000.000' },
    { codigo: '94HSI-BM50BR2', descripcion: 'HELADERA BAJO MESADA 50L CORAL - SIAM RETRO HSI-BM50BR2', localizador: 'A12.000.000' },
    { codigo: '94LSI-LJ15X', descripcion: 'LAVAVAJILLAS 15 CUBIERTOS INOX', localizador: 'B04.000.000' },
    { codigo: '94PHCAV028N', descripcion: 'Cava termoeléctrica de vinos 28 Botellas PHILCO PHCAV028N', localizador: 'A09.000.000' },
    { codigo: '94PHCH144B', descripcion: 'FREEZER POZO BLANCO PHILCO - PHCH144B', localizador: 'PL4.000.000' },
    { codigo: '94PHCH410BM', descripcion: 'Freezer de pozo 400 L PHCH410BM', localizador: 'A08.000.000 / A10.000.000' },
    { codigo: '94PHCH535BM', descripcion: 'Freezer de pozo 520 L PHCH535BM', localizador: 'B09.000.000 / SIN.000.000' },
    { codigo: '94PHL-12016V50', descripcion: 'PILETA ESTRUCTURAL REDONDA PLUS CON PATRÓN RATÁN 6765 L', localizador: 'PL4.000.000' },
    { codigo: '94PHNC382XT', descripcion: 'HELADERA COMBI NO FROST 339 L INOX PHILCO - PHNC382XT', localizador: 'A13.000.000' },
    { codigo: '94RT3N320NMC', descripcion: 'HELADERA HISENSE TOP MOUNT NO FROST INVERTER INOX 320L', localizador: 'A08.000.000 / CAL.000.000' },
    { codigo: '94PHCAV08N2', descripcion: 'CAVA TERMOELECTRICA 8 BOTELLAS PHILCO - PHCAV08N2', localizador: 'B07.000.000' },
    { codigo: '94PHNC417XI', descripcion: 'HELADERA COMBI NO FROST INVERTER 374L INOX PHILCO - PHNC417XI', localizador: 'B01.000.000' },
    { codigo: '94RC-67WSG', descripcion: 'Heladera SBS Hisense Black Glass 564 litros', localizador: 'SIN.000.000' },
    { codigo: '94RQ697HB', descripcion: 'Heladera Cross Door Hisense Inverter + Smart Screen 640 litros', localizador: 'A11.000.000' },
    { codigo: '94RS-20DCS', descripcion: 'Freezer Vertical Hisense Plata 169 litros', localizador: 'A17.000.000 / SCR.00.000' },
    { codigo: '94RT3N461NMC', descripcion: 'HELADERA HISENSE TOP MOUNT NO FROST INVERTER INOX DISPENSER 461L', localizador: 'A12.000.000 / A13.000.000 / A17.000.000 / SIN.000.000' },
  ],
  PL2: [
    { codigo: '91AS12HR4SVRKG03PX4E', descripcion: 'AIRE ACOND. HISENSE SPLIT 3200W FRIO CALOR CL. A (U.E.)', localizador: 'A02.000.000' },
    { codigo: '94RVDR5230RLA2AV1', descripcion: 'SECADOR DE PELO REVLON', localizador: 'A04.000.000' },
    { codigo: '94WS027DBP', descripcion: 'WAFLERA MICKEY NEGRA', localizador: 'A04.000.000' },
    { codigo: '91AS12HR4SVRKG03PX4I', descripcion: 'AIRE ACOND. HISENSE SPLIT 3400W FRIO CALOR CL. A (U.I.)', localizador: 'A05.000.000' },
    { codigo: '94HS622E90S', descripcion: 'LAVAVAJILLA HISENSE 13 CUBIERTOS GRIS', localizador: 'A05.000.000' },
    { codigo: '94PHSA035B', descripcion: 'SECARROPAS BLANCO PHILCO 3,5KG', localizador: 'A05.000.000' },
    { codigo: '94RS3N428NAB', descripcion: 'HELADERA SIDE BY SIDE NEGRA 468L', localizador: 'A05.000.000' },
    { codigo: '94PHBM093B2', descripcion: 'HELADERA BAJO MESADA 93L BLANCA PHILCO - PHBM093B2', localizador: 'A06.000.000' },
    { codigo: '91SAS25HA4CNE', descripcion: 'AIRE ACONDICIONADO SANSEI SPLIT 2750 W F/C (U.E.)', localizador: 'A09.000.000' },
    { codigo: '94GB-XLFTS05FUT5W', descripcion: 'PELOTA DE FUTBOL NUMERO 5 BLANCA', localizador: 'ANA.LIS.IS' },
    { codigo: '9132LQ630BPSA', descripcion: 'Smart TV LG 32" Full HD AI ThinQ 32LQ630BPSA', localizador: 'B05.000.000' },
    { codigo: '9186NANO80TSA', descripcion: 'SMART TV LG NANOCELL 86" ULTRA HD AI THINQ 86NANO80TSA', localizador: 'B05.000.000' },
    { codigo: '94PHCT260X', descripcion: 'Heladera Ciclica Inox 260 L - Codigo Homa: DF2-34', localizador: 'B05.000.000' },
    { codigo: '94RT1N240NED1', descripcion: 'HELADERA HISENSE CÍCLICA TOP MOUNT GRIS 240L', localizador: 'B08.000.000' },
    { codigo: '94WF3S8043BW', descripcion: 'LAVARROPAS 8KG 3S BLANCO SMART INVERTER', localizador: 'B08.000.000' },
    { codigo: '94GB-BX2010BOX14R', descripcion: 'GUANTE DE BOXEO 14 OZ ROJO', localizador: 'B12.000.000' },
    { codigo: '94WTJA802T', descripcion: 'LAVARROPAS HISENSE 6KG TITANIUM CARGA SUPERIOR', localizador: 'C01.000.000' },
    { codigo: '94SQC1', descripcion: 'BARRA DE SONIDO LG SQC1 - 160W 2.1', localizador: 'C02.000.000' },
    { codigo: '94PHNT324BDI', descripcion: 'HELADERA TOP MOUNT NO FROST DISPENSER + INVERTER 324L NETA PHILCO - PHNT324BDI', localizador: 'C07.000.000' },
    { codigo: '94WTJA1402T', descripcion: 'LAVARROPA HISENSE 9,5 KG CARGA SUPERIOR', localizador: 'C07.000.000' },
    { codigo: '94HSI-BM090BR2', descripcion: 'HELADERA BAJO MESADA 90L CORAL HSI-BM090BR2 - SIAM RETRO', localizador: 'C08.000.000' },
    { codigo: '94HSI-EV115B2', descripcion: 'Exhibidora vertical SIAM 115 litros HSI-EV115B2', localizador: 'C08.000.000' },
    { codigo: '91WBJ12B', descripcion: 'AIRE ACOND. WHIRLPOOL SPLIT INVERTER 3000 FRIO CALOR CL. A (U.I.)', localizador: 'C08.000.000' },
    { codigo: '92MH8298DIR-PI', descripcion: 'MICROONDAS LG INVERTIR 42 LITROS NEO CHEFF NEGRO ESPEJADO', localizador: 'C12.000.000' },
    { codigo: '92PHCS07B', descripcion: 'Lavarropas carga superior GRIS PHILCO PHCS07B', localizador: 'C12.000.000' },
    { codigo: '92PHNT198X2', descripcion: 'HELADERA TOP MOUNT NO FROST 198L BRUTO PHILCO - PHNT198X2', localizador: 'C12.000.000' },
    { codigo: '92PSP1217PI', descripcion: 'Plancha Seca PHILCO', localizador: 'C12.000.000' },
    { codigo: '94PHSB555BT', descripcion: 'HELADERA SIDE BY SIDE 555LTS BLANCA CON DISPLAY PHSB555BT', localizador: 'CAL.000.000' },
    { codigo: '94WD90VVC4S6', descripcion: 'LAVASECARROPAS INVERTER LG SILVER CARGA FRONTAL WD90VVC4S6 CON AIDD¿, STEAM, ECO HYBRID DRY Y THINQ 9KG / 5KG 1200 RPM', localizador: 'CAL.000.000' },
    { codigo: '94PHLJ12B', descripcion: 'LAVAVAJILLA 12 CUBIERTOS PHILCO BLANCO', localizador: 'SCR.OCA.SA' },
    { codigo: '94CLSI-CA14B', descripcion: 'CALEFÓN A GAS INVERTER 14 L/MIN TIRO FORZADO SIAM BLANCO', localizador: 'SIN.000.000' },
    { codigo: '94HGAB3024API', descripcion: 'HORNO GRILL ATMA 35 LITROS CON ANAFE', localizador: 'SIN.000.000' },
    { codigo: '94HSI-EV229B2', descripcion: 'Exhibidora vertical SIAM 229 litros Blanca HSI-EV229B2', localizador: 'SIN.000.000' },
    { codigo: '94PHCV181B', descripcion: 'Freezer vertical PHILCO 180 litros Blanco', localizador: 'SIN.000.000' },
    { codigo: '94PHEV400B2', descripcion: 'EXHIBIDORA VERTICAL PHEV400B2 - PHILCO', localizador: 'SIN.000.000' },
    { codigo: '94PHNT504XI', descripcion: 'HELADERA TOP MOUNT NO FROST INVERTER 502L NETA PHILCO - PHNT504XI', localizador: 'SIN.000.000' },
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
    sku: initialSku || '', descripcion: '', localizador: '', nave: 'PL2',
    largo: '', ancho: '', alto: '', peso: '',
    max_apilado: '', se_palletiza: false, unidades_pallet: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [skusRegistrados, setSkusRegistrados] = useState([]);

  // Cargar SKUs ya registrados en Supabase para filtrarlos del desplegable
  useEffect(() => {
    const fetchRegistrados = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from('maestro_sku')
        .select('sku, nave');
      if (data) setSkusRegistrados(data);
    };
    fetchRegistrados();
  }, []);

  // SKUs disponibles = los del catálogo menos los ya registrados en esa nave
  const skusDisponibles = (SKU_POR_NAVE[formData.nave] || []).filter(
    (item) => !skusRegistrados.some(r => r.sku === item.codigo && r.nave === formData.nave)
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Al cambiar la nave, limpiar el SKU seleccionado
  const handleNaveChange = (nave) => {
    setFormData((prev) => ({ ...prev, nave, sku: '', descripcion: '', localizador: '' }));
  };

  // Al seleccionar un SKU del desplegable, auto-completar la descripción y localizador
  const handleSkuChange = (e) => {
    const codigo = e.target.value;
    const item = SKU_POR_NAVE[formData.nave]?.find(s => s.codigo === codigo);
    setFormData((prev) => ({
      ...prev,
      sku: codigo,
      descripcion: item ? item.descripcion : '',
      localizador: item ? item.localizador : '',
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
            <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-1">Producto</label>
            <select
              value={formData.sku}
              onChange={handleSkuChange}
              className={`w-full bg-gray-50 border ${errors.sku ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'} text-gray-800 text-base rounded-[12px] focus:ring-2 focus:ring-[#0099A8] focus:border-transparent outline-none py-3 px-4 appearance-none`}
            >
              <option value="">— Seleccioná un producto —</option>
              {skusDisponibles.map((item) => (
                <option key={item.codigo} value={item.codigo}>
                  [{item.localizador}] {item.descripcion}
                </option>
              ))}
            </select>
            {errors.sku && <p className="text-red-500 text-[9px] mt-1 font-bold">{errors.sku}</p>}
          </div>

          {/* Datos auto-completados (solo lectura) */}
          {formData.descripcion && (
            <div className="mb-4 bg-gray-100 rounded-[12px] px-4 py-3 space-y-1">
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-1">Descripción</p>
              <p className="text-sm text-gray-800 font-medium">{formData.descripcion}</p>
              {formData.localizador && (
                <>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-gray-500 mt-2 mb-1">Localizador</p>
                  <p className="text-sm text-gray-800 font-bold font-mono">{formData.localizador}</p>
                </>
              )}
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

        {/* ── Aviso importante ── */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p className="font-medium">Los datos de peso, dimensiones y apilabilidad máxima figuran en el embalaje del producto.</p>
        </div>

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
