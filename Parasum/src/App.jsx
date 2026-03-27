import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Box, ScanLine, ChevronRight, AlertCircle,
  Layers, Truck, Loader2, Camera, X, Tag, FileText, Search
} from 'lucide-react';

// ─── CATEGORÍAS (CRITERIO) ──────────────────────────────────────────────────
// Valores existentes en el Google Sheet para autocompletar
const CRITERIOS = [
  'Accesorio HVAC','Accesorio Pileta',
  'Aire 2500W','Aire 3000W','Aire 3300W','Aire 3550W','Aire 3750W',
  'Aire 5000W','Aire 5500W','Aire 6300W','Aire 8000W','Aire 8750W',
  'Aire Comercial','Aire Portatil',
  'Aire Ventana 2500W','Aire Ventana 3200W','Aire Ventana 5000W',
  'Aspiradora','Audio',
  'Bicicleta MTB Acero','Bicicleta MTB Aluminio','Bicicleta Spinning',
  'Calefon 14L/min','Campana',
  'Cava 8','Cava 12','Cava 18','Cava 28','Cava 52',
  'Climatizador','Cocina','Colchón','Cortina','Deportes',
  'Exhibidora',
  'Freezer','Freezer 65L','Freezer 100L','Freezer 169L','Freezer 181L','Freezer 297L','Freezer 400L','Freezer 520L',
  'Freidora de Aire','Freidora 9L','Freidora 12L','Freidora 17L',
  'Gazebo','Generador',
  'Heladera 50L','Heladera 123L','Heladera 161L','Heladera 179L','Heladera 250L',
  'Heladera 302L','Heladera 320L','Heladera 339L','Heladera 374L','Heladera 375L',
  'Heladera 385L','Heladera 461L','Heladera 564L','Heladera 640L','Heladera Panelable',
  'Hogar Pequeño','Horno Empotrar',
  'Horno Grill 30L','Horno Grill 50L','Horno Grill 60L','Horno Grill 70L',
  'HVAC Comercial','Kayak',
  'Lavarropas 6.5kg','Lavarropas 8kg','Lavarropas 10kg','Lavarropas Semi',
  'Lavasecarropas','Lavavajillas 14',
  'Microondas','Monitor','Notebook',
  'Pileta','Plancha','Purificador',
  'Secador','Secarropas',
  'Termotanque','Tostadora',
  'TV 32"','TV 40"','TV 43"','TV 50"','TV 55"','TV 65"','TV 75"','TV 85"',
  'Ventilador','Waflera',
].sort();

// ─── CONFIGURACIÓN ──────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ─── FUNCIÓN: ENVIAR A GOOGLE SHEETS ────────────────────────────────────────
const appendToGoogleSheet = async (row) => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn('VITE_GOOGLE_SCRIPT_URL no configurada — no se sincroniza con Google Sheets');
    return { success: false, error: 'URL no configurada' };
  }
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(row),
    });
    return await res.json();
  } catch (err) {
    console.error('Error enviando a Google Sheets:', err);
    return { success: false, error: err.message };
  }
};

// ─── COMPONENTES UI REUTILIZABLES ───────────────────────────────────────────

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

// ─── COMPONENTE: ESCÁNER DE BARCODE ─────────────────────────────────────────

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

// ─── COMPONENTE: CAPTURA DE FOTO ────────────────────────────────────────────

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

// ─── COMPONENTE: SELECTOR DE CRITERIO CON BÚSQUEDA ─────────────────────────

const CriterioSelector = ({ value, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = CRITERIOS.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-4">
      <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-1">Criterio / Categoría</label>

      {/* Valor seleccionado o botón para abrir */}
      <button type="button" onClick={() => setOpen(!open)}
        className={`w-full bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-200'} text-left text-base rounded-[12px] py-3 px-4 flex items-center justify-between`}>
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value || '— Seleccioná una categoría —'}
        </span>
        <Tag size={18} className="text-gray-400" />
      </button>

      {open && (
        <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
          {/* Buscador */}
          <div className="p-2 border-b border-gray-100 flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar categoría..."
              className="flex-1 text-sm outline-none bg-transparent"
              autoFocus
            />
          </div>
          {/* Lista */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((c) => (
              <button key={c} type="button"
                onClick={() => { onChange(c); setOpen(false); setSearch(''); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${value === c ? 'bg-[#0099A8]/10 text-[#0099A8] font-bold' : 'text-gray-700'}`}>
                {c}
              </button>
            ))}
            {filtered.length === 0 && search && (
              <button type="button"
                onClick={() => { onChange(search); setOpen(false); setSearch(''); }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#0099A8] font-bold">
                + Usar "{search}" como nuevo criterio
              </button>
            )}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 text-[9px] mt-1 font-bold">{error}</p>}
    </div>
  );
};

// ─── FORMULARIO DE NUEVO SKU ────────────────────────────────────────────────

const SKUForm = ({ initialSku, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    sku: initialSku || '', descripcion: '', nave: 'PL2', criterio: '',
    largo: '', ancho: '', alto: '', peso: '',
    max_apilado: '', se_palletiza: false, unidades_pallet: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [sheetStatus, setSheetStatus] = useState(null); // null | 'ok' | 'error'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleScanResult = (code) => {
    setFormData((prev) => ({ ...prev, sku: code }));
    setShowScanner(false);
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
    setLoading(true);
    setErrors({});
    setSheetStatus(null);

    // Validación
    const newErrors = {};
    if (!formData.sku.trim()) newErrors.sku = 'Ingresá un código SKU';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'Ingresá una descripción';
    if (!formData.criterio.trim()) newErrors.criterio = 'Seleccioná un criterio';
    if (!formData.max_apilado) newErrors.max_apilado = 'Ingresá el apilado máximo';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const skuClean = formData.sku.trim().toUpperCase();

    // Datos comunes para Supabase y Google Sheets
    const rowData = {
      sku: skuClean,
      descripcion: formData.descripcion.trim(),
      nave: formData.nave,
      criterio: formData.criterio,
      largo_cm: parseFloat(formData.largo) || 0,
      ancho_cm: parseFloat(formData.ancho) || 0,
      alto_cm: parseFloat(formData.alto) || 0,
      peso_kg: parseFloat(formData.peso) || 0,
      max_apilado: parseInt(formData.max_apilado) || 0,
      unidades_pallet: formData.se_palletiza ? (parseInt(formData.unidades_pallet) || 0) : 0,
    };

    // 1. Guardar en Supabase (si está configurado)
    if (supabase) {
      const { data: existing } = await supabase
        .from('maestro_sku')
        .select('id')
        .eq('sku', skuClean)
        .eq('nave', formData.nave)
        .maybeSingle();

      if (existing) {
        setErrors({ sku: `El SKU ${skuClean} ya existe en ${formData.nave}` });
        setLoading(false);
        return;
      }

      const fotoUrl = await uploadPhoto(skuClean);

      const { error } = await supabase.from('maestro_sku').insert([{
        ...rowData,
        unidades_por_pallet: rowData.unidades_pallet || null,
        foto_url: fotoUrl,
      }]);

      if (error) {
        setErrors({ form: 'Error Supabase: ' + error.message });
        setLoading(false);
        return;
      }
    }

    // 2. Agregar fila al Google Sheet
    const sheetResult = await appendToGoogleSheet(rowData);
    if (sheetResult.success) {
      setSheetStatus('ok');
    } else {
      setSheetStatus('error');
      console.warn('Google Sheets sync falló:', sheetResult.error);
    }

    // Éxito — volver al dashboard después de un breve delay para mostrar el estado
    setTimeout(() => onSave(), sheetResult.success ? 600 : 1500);
  };

  if (showScanner) {
    return <BarcodeScanner onDetected={handleScanResult} onClose={() => setShowScanner(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#efefff] pb-24 font-verdana">
      <Header title="Nuevo SKU" />

      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* ── Datos principales ── */}
        <Card>
          {/* Selector de Nave */}
          <div className="mb-4">
            <label className="block text-[9px] font-bold text-gray-500 mb-2 uppercase">Nave</label>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['PL2', 'PL3'].map((n) => (
                <button key={n} type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, nave: n }))}
                  className={`flex-1 py-3 rounded-[10px] text-sm font-bold transition-all ${
                    formData.nave === n ? 'bg-[#0099A8] text-white shadow-md' : 'text-gray-500'
                  }`}>{n}</button>
              ))}
            </div>
          </div>

          {/* SKU: input libre + botón escáner */}
          <InputGroup
            label="Código SKU"
            id="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Escaneá o escribí el código"
            icon={Box}
            error={errors.sku}
            rightElement={
              <button type="button" onClick={() => setShowScanner(true)}
                className="bg-[#0099A8] text-white px-4 rounded-[12px] flex items-center gap-1 active:scale-95 transition-all">
                <ScanLine size={20} />
              </button>
            }
          />

          {/* Descripción: libre */}
          <InputGroup
            label="Descripción"
            id="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Nombre / descripción del producto"
            icon={FileText}
            error={errors.descripcion}
          />

          {/* Criterio / Categoría */}
          <CriterioSelector
            value={formData.criterio}
            onChange={(val) => setFormData((prev) => ({ ...prev, criterio: val }))}
            error={errors.criterio}
          />
        </Card>

        {/* ── Foto del producto ── */}
        <Card>
          <PhotoCapture
            photo={photo}
            onCapture={handlePhotoCapture}
            onRemove={() => setPhoto(null)}
          />
        </Card>

        {/* ── Aviso ── */}
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
          <InputGroup label="Niveles de Apilado" id="max_apilado" type="number" value={formData.max_apilado} onChange={handleChange} icon={Layers} error={errors.max_apilado} />

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

        {/* ── Estado de sincronización ── */}
        {sheetStatus === 'ok' && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm font-bold p-4 rounded-xl">
            <span>✓</span> SKU guardado y sincronizado con Google Sheets
          </div>
        )}
        {sheetStatus === 'error' && (
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 text-sm font-bold p-4 rounded-xl">
            <AlertCircle size={18} />
            SKU guardado en Supabase, pero no se pudo sincronizar con Google Sheets. Se reintentará.
          </div>
        )}

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

// ─── APP PRINCIPAL ──────────────────────────────────────────────────────────

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

        {/* Indicador de conexión Google Sheets */}
        <div className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl mb-4 ${
          GOOGLE_SCRIPT_URL ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${GOOGLE_SCRIPT_URL ? 'bg-green-500' : 'bg-yellow-500'}`} />
          {GOOGLE_SCRIPT_URL ? 'Sincronización con Google Sheets activa' : 'Google Sheets no configurado'}
        </div>

        {/* CTA principal */}
        <button onClick={() => setView('form')}
          className="w-full bg-gradient-to-r from-[#0099A8] to-[#056572] text-white py-8 rounded-[24px] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all mb-8">
          <ScanLine size={32} />
          <div className="text-left">
            <p className="text-xl font-bold">Nuevo SKU</p>
            <p className="text-xs opacity-80 font-normal">Escáner o ingreso manual</p>
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
