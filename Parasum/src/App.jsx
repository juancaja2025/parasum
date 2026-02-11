import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Box, ScanLine, ChevronRight, AlertCircle,
  Layers, Truck, Loader2
} from 'lucide-react';

// ─── CONFIGURACIÓN DE SUPABASE ───────────────────────────────────────────────
// Reemplaza estas variables con tus credenciales de Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ─── COMPONENTES UI REUTILIZABLES ────────────────────────────────────────────

const Button = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const style =
    variant === 'primary'
      ? { backgroundColor: '#0099A8', color: 'white' }
      : { backgroundColor: 'white', color: '#0099A8', border: '2px solid #0099A8' };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-btn font-bold text-center transition-all active:scale-95 flex items-center justify-center gap-2 text-base ${disabled ? 'opacity-50' : ''} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

const InputGroup = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  inputMode,
  icon: Icon,
  suffix,
  error,
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={20} />
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        className={`w-full bg-gray-50 border ${
          error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
        } text-gray-800 text-lg rounded-input focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none py-3 ${
          Icon ? 'pl-12' : 'pl-4'
        } ${suffix ? 'pr-12' : 'pr-4'}`}
      />
      {suffix && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
          {suffix}
        </div>
      )}
    </div>
    {error && <p className="text-red-500 text-[9px] mt-1 font-bold">{error}</p>}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-card shadow-sm border border-gray-100 p-5 ${className}`}>
    {children}
  </div>
);

// ─── HEADER ──────────────────────────────────────────────────────────────────

const Header = ({ title }) => (
  <header className="bg-white sticky top-0 z-50 px-6 py-4 shadow-sm flex justify-between items-center">
    <h1 className="text-[20px] font-bold text-gray-800">{title}</h1>
    <img src="/logo.png" alt="Parasum" className="h-8 w-auto" />
  </header>
);

// ─── FORMULARIO DE SKU ───────────────────────────────────────────────────────

const SKUForm = ({ initialSku, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    sku: initialSku || '',
    descripcion: '',
    nave: 'PL2',
    largo: '',
    ancho: '',
    alto: '',
    peso: '',
    max_apilado: '',
    se_palletiza: false,
    unidades_pallet: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supabase) {
      alert('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env');
      return;
    }

    setLoading(true);
    setErrors({});

    // Validaciones básicas
    if (!formData.sku || !formData.descripcion || !formData.max_apilado) {
      setErrors({ form: 'Completa los campos obligatorios.' });
      setLoading(false);
      return;
    }

    // Verificar duplicado (SKU + Nave)
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

    // Guardar en Supabase
    const { error } = await supabase.from('maestro_sku').insert([
      {
        sku: formData.sku,
        descripcion: formData.descripcion,
        nave: formData.nave,
        largo_cm: parseFloat(formData.largo) || 0,
        ancho_cm: parseFloat(formData.ancho) || 0,
        alto_cm: parseFloat(formData.alto) || 0,
        peso_kg: parseFloat(formData.peso) || 0,
        max_apilado: parseInt(formData.max_apilado) || 0,
        unidades_por_pallet: formData.se_palletiza
          ? parseInt(formData.unidades_pallet)
          : null,
      },
    ]);

    if (error) {
      setErrors({ form: 'Error al guardar: ' + error.message });
      setLoading(false);
    } else {
      onSave();
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg pb-24 font-verdana">
      <Header title="Registro Parasum" />

      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* ── Datos principales ── */}
        <Card>
          <InputGroup
            label="Código SKU"
            id="sku"
            value={formData.sku}
            onChange={handleChange}
            icon={Barcode}
            error={errors.sku}
          />

          <div className="mb-4">
            <label className="block text-[9px] font-bold text-gray-500 mb-2 uppercase">
              Nave
            </label>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['PL2', 'PL3'].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormData({ ...formData, nave: n })}
                  className={`flex-1 py-3 rounded-[10px] text-sm font-bold transition-all ${
                    formData.nave === n
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'text-gray-500'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <InputGroup
            label="Descripción"
            id="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Nombre del artículo"
          />
        </Card>

        {/* ── Dimensiones ── */}
        <Card>
          <div className="grid grid-cols-3 gap-3">
            <InputGroup
              label="Largo"
              id="largo"
              type="number"
              value={formData.largo}
              onChange={handleChange}
              suffix="cm"
            />
            <InputGroup
              label="Ancho"
              id="ancho"
              type="number"
              value={formData.ancho}
              onChange={handleChange}
              suffix="cm"
            />
            <InputGroup
              label="Alto"
              id="alto"
              type="number"
              value={formData.alto}
              onChange={handleChange}
              suffix="cm"
            />
          </div>
          <InputGroup
            label="Peso Bruto"
            id="peso"
            type="number"
            value={formData.peso}
            onChange={handleChange}
            suffix="kg"
            icon={Box}
          />
        </Card>

        {/* ── Almacenamiento ── */}
        <Card>
          <InputGroup
            label="Niveles de Apilado"
            id="max_apilado"
            type="number"
            value={formData.max_apilado}
            onChange={handleChange}
            icon={Layers}
          />

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <label className="text-sm font-bold text-gray-700">¿Se palletiza?</label>
            <div
              className={`toggle-track ${
                formData.se_palletiza ? 'toggle-track--on' : 'toggle-track--off'
              }`}
              onClick={() =>
                setFormData({ ...formData, se_palletiza: !formData.se_palletiza })
              }
            >
              <div
                className={`toggle-thumb ${
                  formData.se_palletiza ? 'toggle-thumb--on' : ''
                }`}
              />
            </div>
          </div>

          {formData.se_palletiza && (
            <div className="mt-4 animate-fade-in-up">
              <InputGroup
                label="Unid. por Pallet"
                id="unidades_pallet"
                type="number"
                value={formData.unidades_pallet}
                onChange={handleChange}
                icon={Truck}
              />
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
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
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
      .limit(5);
    if (data) setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ── Vista: Formulario ──
  if (view === 'form') {
    return (
      <SKUForm
        onSave={() => {
          setView('dashboard');
          fetchHistory();
        }}
        onCancel={() => setView('dashboard')}
      />
    );
  }

  // ── Vista: Dashboard ──
  return (
    <div className="min-h-screen bg-surface-bg font-verdana">
      <Header title="Parasum Digital" />

      <main className="px-4 py-6 max-w-md mx-auto">
        {/* Estado de depósitos */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-brand-dark text-white border-none shadow-lg">
            <span className="text-[9px] uppercase font-bold opacity-70">Depósito PL2</span>
            <p className="text-2xl font-bold">Activo</p>
          </Card>
          <Card className="bg-brand-primary text-white border-none shadow-lg">
            <span className="text-[9px] uppercase font-bold opacity-70">Depósito PL3</span>
            <p className="text-2xl font-bold">Activo</p>
          </Card>
        </div>

        {/* CTA principal */}
        <button
          onClick={() => setView('form')}
          className="w-full bg-gradient-to-r from-brand-primary to-brand-dark text-white py-8 rounded-[24px] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all mb-8"
        >
          <Barcode size={32} />
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
            <p className="text-center text-gray-400 text-xs py-4">
              Sin datos de Supabase — Configura las variables de entorno
            </p>
          ) : (
            history.map((item, i) => (
              <Card key={item.id || i} className="flex items-center gap-4 py-3">
                <div className="bg-gray-100 p-2 rounded-lg text-brand-primary">
                  <Box size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-sm">{item.sku}</p>
                    <span className="text-[9px] font-bold bg-blue-50 text-brand-primary px-2 rounded-full">
                      {item.nave}
                    </span>
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
