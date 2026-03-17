# IRON TRACK

App de entrenamiento — React + Vite + Tailwind CSS

## Stack
- **React 18** + **Vite 5**
- **Tailwind CSS 3** con colores custom de IRON TRACK
- **Supabase** para datos en la nube
- **Vercel** para deploy + funciones serverless

## Setup local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Deploy a Vercel

1. Conectar el repo en vercel.com
2. Agregar variable de entorno: `ANTHROPIC_API_KEY`
3. Vercel corre `npm run build` automáticamente al hacer push

## Estructura

```
src/
├── App.jsx                   # Estado global + routing por tabs
├── main.jsx                  # Entry point
├── index.css                 # Tailwind + clases base
├── constants/
│   ├── exercises.js          # EX[], PATS, VIDEOS, IMGS
│   └── config.js             # Keys, IDs, URLs
├── hooks/
│   ├── useSession.js         # Login / logout
│   └── useSupabase.js        # Toda la lógica de fetch a SB
├── lib/
│   └── supabase.js           # Cliente Supabase
└── components/
    ├── ui/                   # Componentes reutilizables
    │   ├── NavBar.jsx
    │   ├── Toast.jsx
    │   ├── Modal.jsx
    │   ├── Avatar.jsx
    │   └── Chip.jsx
    ├── Dashboard.jsx          # Dashboard entrenador (tab PLAN)
    ├── LibraryAlumno.jsx      # Biblioteca alumno (tab BIBL)
    ├── LoginForm.jsx
    ├── Library.jsx            # TODO: biblioteca entrenador
    ├── Routines.jsx           # TODO: gestión de rutinas
    ├── Scanner.jsx            # TODO: scanner IA
    ├── Progress.jsx           # TODO: progreso y PRs
    └── Alumnos.jsx            # TODO: gestión de alumnos
```

## Colores Tailwind disponibles

| Clase         | Uso                          |
|---------------|------------------------------|
| `bg-base`     | Fondo principal `#07080d`    |
| `bg-surface`  | Cards `#0e1018`              |
| `bg-deep`     | Inputs `#0a0c14`             |
| `border-border` | Bordes cards `#1a1d2e`     |
| `text-muted`  | Texto secundario `#4a5568`   |
| `text-brand`  | Rojo IRON TRACK `#ef4444`    |
| `text-green`  | Verde éxito `#22c55e`        |
| `text-amber`  | PRs / advertencia `#f59e0b`  |
