import { useState } from 'react'
import Chip, { ChipRow } from './ui/Chip'

const GRUPOS = [
  { key: 'todos',     label: 'TODO',       icon: '⚡',  color: '#ef4444' },
  { key: 'movilidad', label: 'MOVILIDAD',  icon: '🌀',  color: '#e879f9' },
  { key: 'core',      label: 'CORE',       icon: '🎯',  color: '#facc15' },
  { key: 'inferior',  label: 'TREN INF.',  icon: '🦵',  color: '#4ade80' },
  { key: 'superior',  label: 'TREN SUP.',  icon: '💪🏽', color: '#60a5fa' },
  { key: 'oly',       label: 'OLÍMPICOS',  icon: '🏋️',  color: '#fbbf24' },
  { key: 'cardio',    label: 'CARDIO',     icon: '🏃',  color: '#22d3ee' },
]

const GRUPO_MAP = {
  empuje: 'superior', traccion: 'superior',
  bisagra: 'inferior', rodilla: 'inferior', pierna: 'inferior',
  core: 'core', movilidad: 'movilidad', movil: 'movilidad',
  cardio: 'cardio', oly: 'oly',
}

const SUB_MAP = {
  empuje: 'Pecho / Hombros / Tríceps', traccion: 'Espalda / Bíceps',
  bisagra: 'Isquiotibiales / Glúteos', rodilla: 'Cuadriceps', pierna: 'Pierna',
  core: 'Core', movilidad: 'Movilidad', movil: 'Movilidad',
  cardio: 'Cardio', oly: 'Olímpicos',
}

export default function LibraryAlumno({ allEx = [] }) {
  const [grupo, setGrupo] = useState('todos')
  const [q, setQ]         = useState('')

  const exConGrupo = allEx.map(e => ({
    ...e,
    grupoAlu: GRUPO_MAP[e.pattern] || 'superior',
    subAlu:   SUB_MAP[e.pattern]   || '',
  }))

  const filtered = exConGrupo.filter(e => {
    const matchQ = !q || e.name.toLowerCase().includes(q.toLowerCase())
    const matchG = grupo === 'todos' || e.grupoAlu === grupo
    return matchQ && matchG
  })

  const g        = GRUPOS.find(x => x.key === grupo)
  const buscando = q.length > 0

  const ExCard = ({ ex, showGrupo }) => {
    const grp = GRUPOS.find(x => x.key === ex.grupoAlu)
    const col = grp?.color || '#9ca3af'
    return (
      <div className="card mb-2">
        <div className="text-[15px] font-extrabold">{ex.name}</div>
        <div className="flex gap-1.5 mt-1.5 flex-wrap items-center">
          {showGrupo && (
            <span className="tag font-bold" style={{ background: col + '22', color: col }}>
              {(grp?.label || ex.grupoAlu).toUpperCase()}
            </span>
          )}
          <span className="tag bg-border text-soft">{ex.equip}</span>
          {ex.youtube && (
            <a href={ex.youtube} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand px-2 py-0.5 rounded"
              style={{ background: '#ef444422', border: '1px solid #ef444433' }}>
              ▶ VIDEO
            </a>
          )}
        </div>
      </div>
    )
  }

  const renderCuerpo = () => {
    if (buscando || grupo === 'todos') {
      return filtered.map(e => <ExCard key={e.id} ex={e} showGrupo={true} />)
    }
    const subs = [...new Set(filtered.map(e => e.subAlu).filter(Boolean))]
    if (subs.length <= 1) return filtered.map(e => <ExCard key={e.id} ex={e} showGrupo={false} />)
    return subs.map(sub => (
      <div key={sub}>
        <div className="text-[11px] font-bold tracking-widest my-3" style={{ color: g?.color }}>
          — {sub.toUpperCase()}
        </div>
        {filtered.filter(e => e.subAlu === sub).map(e => <ExCard key={e.id} ex={e} showGrupo={false} />)}
      </div>
    ))
  }

  return (
    <div>
      <input
        className="input mb-3"
        placeholder="🔍 Buscar ejercicio..."
        value={q}
        onChange={e => { setQ(e.target.value); setGrupo('todos') }}
      />

      <ChipRow>
        {GRUPOS.map(gr => (
          <Chip key={gr.key} label={gr.label} icon={gr.icon} color={gr.color}
            active={grupo === gr.key}
            onClick={() => { setGrupo(gr.key); setQ('') }}
          />
        ))}
      </ChipRow>

      {/* Header grupo activo */}
      {grupo !== 'todos' && !buscando && (
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl"
          style={{ background: g.color + '15', border: '1px solid ' + g.color + '33' }}>
          <span className="text-[22px]">{g.icon}</span>
          <div className="text-[18px] font-black" style={{ color: g.color }}>{g.label}</div>
          <div className="ml-auto text-[13px] font-bold" style={{ color: g.color }}>{filtered.length} ejercicios</div>
        </div>
      )}

      <div className="text-[12px] text-muted mb-3">{filtered.length} ejercicios</div>
      {renderCuerpo()}
    </div>
  )
}
