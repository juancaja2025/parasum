# Guía Completa: Deploy de Parasum Digital en Producción

## Resumen de la Arquitectura

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Usuario    │──────▶│   Vercel    │──────▶│  Supabase   │
│  (Celular)   │◀──────│  (Frontend) │◀──────│   (Base)    │
└─────────────┘       └─────────────┘       └─────────────┘
```

---

## FASE 1 — Preparar Supabase

> Ya tenés el proyecto `tamkejktrjzluaitwxqb.supabase.co` del Dock Manager.
> Podés usar el mismo proyecto o crear uno nuevo.

### Paso 1.1: Crear la tabla `maestro_sku`

1. Abrí **[supabase.com](https://supabase.com)** → tu proyecto
2. Menú izquierdo → **SQL Editor**
3. Pegá este SQL y hacé click en **Run**:

```sql
CREATE TABLE IF NOT EXISTS maestro_sku (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku           TEXT NOT NULL,
  descripcion   TEXT NOT NULL,
  nave          TEXT NOT NULL DEFAULT 'PL2',
  largo_cm      NUMERIC DEFAULT 0,
  ancho_cm      NUMERIC DEFAULT 0,
  alto_cm       NUMERIC DEFAULT 0,
  peso_kg       NUMERIC DEFAULT 0,
  max_apilado   INTEGER DEFAULT 0,
  unidades_por_pallet INTEGER,
  fecha_registro TIMESTAMPTZ DEFAULT now()
);

-- Índice para evitar duplicados de SKU por nave
CREATE UNIQUE INDEX IF NOT EXISTS idx_sku_nave ON maestro_sku (sku, nave);
```

4. Deberías ver **"Success. No rows returned"**

### Paso 1.2: Habilitar permisos (RLS)

En el mismo SQL Editor, pegá y ejecutá:

```sql
-- Habilitar Row Level Security
ALTER TABLE maestro_sku ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
CREATE POLICY "Lectura publica" ON maestro_sku
  FOR SELECT USING (true);

-- Permitir inserción pública
CREATE POLICY "Insercion publica" ON maestro_sku
  FOR INSERT WITH CHECK (true);

-- Permitir actualización pública
CREATE POLICY "Actualizacion publica" ON maestro_sku
  FOR UPDATE USING (true);
```

> **Nota:** Estas políticas son abiertas. Para producción con auth,
> después podemos restringir a usuarios logueados.

### Paso 1.3: Copiar credenciales

1. Menú izquierdo → **Project Settings** (⚙️)
2. Click en **API**
3. Copiá estos dos valores y guardalos en un notepad:

```
Project URL:  https://tamkejktrjzluaitwxqb.supabase.co
Anon Key:     eyJhbGciOi... (la cadena larga de "anon public")
```

> ⚠️ Copiá el **anon public**, NO el **service_role**.

---

## FASE 2 — Preparar los archivos del proyecto

### Paso 2.1: Estructura de carpetas

Creá esta estructura en una carpeta nueva `parasum-digital`:

```
parasum-digital/
├── public/
│   └── logo.png          ← TU LOGO ACÁ (PNG o SVG)
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local             ← Credenciales (NO se sube a GitHub)
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

### Paso 2.2: Dónde poner el logo

1. Creá la carpeta `public/` dentro de `parasum-digital/`
2. Copiá tu archivo de logo ahí adentro. Idealmente:
   - Formato: **PNG** con fondo transparente o **SVG**
   - Nombre: `logo.png` (o `logo.svg`)
   - Tamaño recomendado: entre 100px y 300px de ancho

En el código (`App.jsx`), el logo se usa así:

```jsx
// En vez de este placeholder:
<div className="h-8 ... font-bold text-[10px]">LOGO</div>

// Va esto:
<img src="/logo.png" alt="Parasum" className="h-8 w-auto" />
```

> Más adelante en el Paso 2.4 ya te doy el App.jsx completo con esto cambiado.

### Paso 2.3: Crear el archivo `.env.local`

En la raíz del proyecto, creá `.env.local` con tus credenciales:

```env
VITE_SUPABASE_URL=https://tamkejktrjzluaitwxqb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.PEGA_TU_KEY_COMPLETA
```

> Este archivo es **solo local**. GitHub no lo sube (lo excluimos en .gitignore).
> Vercel recibe las credenciales por separado (Fase 4).

### Paso 2.4: Crear el archivo `.gitignore`

```gitignore
node_modules
dist
.env
.env.local
.env.*.local
*.log
```

### Paso 2.5: Archivos del proyecto

Usá los archivos que te generé antes. Estos son:

- `package.json` → tal cual te lo pasé
- `vite.config.js` → tal cual
- `postcss.config.js` → tal cual
- `tailwind.config.js` → tal cual
- `index.html` → tal cual
- `src/main.jsx` → tal cual
- `src/index.css` → tal cual
- `src/App.jsx` → **con un cambio**: reemplazar el placeholder del logo

Buscá esta línea en `App.jsx`:

```jsx
<div className="h-8 w-auto flex items-center justify-center font-bold text-[10px] text-brand-primary border-2 border-brand-primary px-2 rounded">
  LOGO
</div>
```

Y reemplazala por:

```jsx
<img src="/logo.png" alt="Parasum" className="h-8 w-auto" />
```

> Si tu logo es SVG, cambiá `/logo.png` por `/logo.svg`.

---

## FASE 3 — Subir a GitHub

### Paso 3.1: Crear repositorio en GitHub

1. Abrí **[github.com](https://github.com)** → logueate
2. Click en **"+"** (arriba a la derecha) → **New repository**
3. Configurá:
   - **Repository name:** `parasum-digital`
   - **Visibility:** Private (recomendado)
   - **NO** marques "Add a README" ni nada más
4. Click **Create repository**

### Paso 3.2: Subir los archivos

**Opción A — Desde la terminal (si tenés Git instalado):**

```bash
cd parasum-digital
git init
git add .
git commit -m "Primer commit - Parasum Digital"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/parasum-digital.git
git push -u origin main
```

**Opción B — Desde GitHub (sin terminal):**

1. En el repo vacío, click en **"uploading an existing file"**
2. Arrastrá TODOS los archivos y carpetas (**excepto** `.env.local` y `node_modules`)
3. Click **Commit changes**

> ⚠️ **IMPORTANTE:** NO subas `.env.local`. Las credenciales van en Vercel.

### Paso 3.3: Verificar que se subieron bien

Tu repositorio debería verse así:

```
parasum-digital/
├── public/
│   └── logo.png
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## FASE 4 — Deploy en Vercel

### Paso 4.1: Importar proyecto

1. Abrí **[vercel.com](https://vercel.com)** → logueate con GitHub
2. Click **"Add New..."** → **Project**
3. Buscá `parasum-digital` en la lista → click **Import**

### Paso 4.2: Configurar variables de entorno

**ANTES de hacer click en Deploy**, buscá la sección **"Environment Variables"** y agregá:

| Key                     | Value                                      |
|-------------------------|--------------------------------------------|
| `VITE_SUPABASE_URL`    | `https://tamkejktrjzluaitwxqb.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (tu anon key completa)   |

Para cada una:
1. Escribí el **Name** (ej: `VITE_SUPABASE_URL`)
2. Pegá el **Value**
3. Click **Add**

### Paso 4.3: Configurar build

Vercel debería autodetectar Vite, pero verificá que diga:

```
Framework Preset:  Vite
Build Command:     npm run build
Output Directory:  dist
Install Command:   npm install
```

### Paso 4.4: Deploy

1. Click **"Deploy"**
2. Esperá 1-2 minutos
3. Si sale ✅ → Vercel te da una URL tipo `parasum-digital.vercel.app`
4. Si sale ❌ → Mandame la captura del error

### Paso 4.5: Probar

1. Abrí la URL que te dio Vercel en el celular
2. Deberías ver el dashboard con tu logo
3. Tocá "Nuevo Registro" y probá cargar un SKU
4. Verificá en Supabase (Table Editor → `maestro_sku`) que se guardó

---

## FASE 5 — Dominio personalizado (opcional)

Si querés usar un dominio propio (ej: `parasum.ocasa.com`):

1. En Vercel → tu proyecto → **Settings** → **Domains**
2. Escribí el dominio → **Add**
3. Vercel te da registros DNS para configurar
4. Pedí a IT que agregue esos registros DNS

---

## FASE 6 — Agregar al celular como "app"

### Android:
1. Abrí la URL en Chrome
2. Menú (⋮) → **"Agregar a pantalla de inicio"**
3. Listo, queda como ícono de app

### iPhone:
1. Abrí la URL en Safari
2. Botón compartir (⬆) → **"Agregar a inicio"**
3. Listo

---

## Resumen de credenciales necesarias

| Qué | Dónde lo conseguís | Dónde lo ponés |
|-----|---------------------|----------------|
| Supabase URL | Supabase → Settings → API | Vercel → Environment Variables |
| Supabase Anon Key | Supabase → Settings → API | Vercel → Environment Variables |
| GitHub repo | Lo creás vos | Vercel lo importa automáticamente |

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Build falla con "npm install exited with 254" | Ir a Settings → General → Node.js Version → poner **18.x** → Redeploy |
| "Sin datos de Supabase" en el dashboard | Verificá que las env vars en Vercel tengan `VITE_` adelante |
| Logo no se ve | Verificá que está en `public/logo.png` y que en App.jsx dice `src="/logo.png"` |
| Error "relation maestro_sku does not exist" | El SQL del Paso 1.1 no se ejecutó. Volvé a correrlo |
| SKU duplicado no deja guardar | Es correcto: el índice único previene duplicados por nave |
| Cambié las env vars pero no se actualizan | Después de cambiar vars en Vercel, hacé **Redeploy** |
