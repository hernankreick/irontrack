import { EX, PATS } from '../constants/exercises'

const RPE_COLORS = { '6': '#22c55e', '7': '#84cc16', '8': '#eab308', '9': '#f97316', '10': '#ef4444' }

const pat = (pattern) =>
  PATS[pattern] || { icon: '💪', color: '#9ca3af', label: 'Otro' }

export default function Progress({ progress = {}, es, onDetailEx }) {
  const exConDatos = EX.filter(ex => progress[ex.id]?.sets?.length > 0)

  if (exConDatos.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <div className="text-[48px] mb-3">📊</div>
        <div className="text-[20px] font-bold tracking-wide">
          {es ? 'Sin registros aún' : 'No records yet'}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-[16px] font-extrabold tracking-wide mb-3">📊 {es ? 'MI PROGRESO' : 'MY PROGRESS'}</div>
      {exConDatos.map(ex => {
        const p   = pat(ex.pattern)
        const pg  = progress[ex.id]
        const max = Math.max(...(pg.sets || []).map(s => s.kg || 0))
        return (
          <div key={ex.id} className="card mb-2 btn-tap cursor-pointer" onClick={() => onDetailEx?.(ex)}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[22px]">{p.icon}</span>
              <div className="flex-1">
                <div className="text-[18px] font-bold">{ex.name}</div>
                <div className="text-[13px] text-muted">{ex.muscle}</div>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-bold" style={{ color: p.color }}>{max}kg</div>
                <div className="text-[11px] text-muted">máx</div>
              </div>
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {(pg.sets || []).slice(0, 5).map((s, i) => (
                <div key={i} className="bg-mid rounded px-2 py-1 shrink-0 text-[12px]">
                  <div className="font-bold">{s.kg}kg × {s.reps}</div>
                  <div className="text-muted">{s.date}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Historial de sesiones del alumno (componente separado)
export function HistorialSesiones({ sesiones = [], es }) {
  if (!sesiones.length) {
    return <div className="text-center py-8 text-muted text-[14px]">{es ? 'Sin sesiones aún' : 'No sessions yet'}</div>
  }

  const byFecha = {}
  sesiones.forEach(s => {
    if (!byFecha[s.fecha]) byFecha[s.fecha] = []
    byFecha[s.fecha].push(s)
  })
  const fechas = Object.keys(byFecha).sort((a, b) => b.localeCompare(a))

  return (
    <div>
      {fechas.slice(0, 10).map(fecha => {
        const sets   = byFecha[fecha]
        const rpeProm = sets.filter(s => s.rpe).length
          ? Math.round(sets.filter(s => s.rpe).reduce((a, b) => a + (b.rpe || 0), 0) / sets.filter(s => s.rpe).length)
          : null
        const rpeCol = rpeProm >= 9 ? '#ef4444' : rpeProm >= 8 ? '#f97316' : rpeProm >= 7 ? '#eab308' : '#22c55e'
        return (
          <div key={fecha} className="bg-deep rounded-xl p-3 mb-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[13px] font-extrabold">{fecha}</div>
              <span className="text-[11px] font-bold text-green-500">{sets.length} registros</span>
            </div>
            {rpeProm && (
              <div className="text-[12px] text-soft">
                RPE promedio: <strong style={{ color: rpeCol }}>{rpeProm}</strong>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Registros por ejercicio con tendencia
export function RegistrosPorEjercicio({ progreso = [], es }) {
  const byEx = {}
  progreso.forEach(p => {
    if (!byEx[p.ejercicio_id]) byEx[p.ejercicio_id] = { sets: [] }
    byEx[p.ejercicio_id].sets.push(p)
  })

  return (
    <div>
      {Object.entries(byEx).slice(0, 8).map(([exId, data]) => {
        const exData  = EX.find(e => e.id === exId)
        const maxKg   = Math.max(...data.sets.map(s => s.kg || 0))
        const last    = data.sets[0]
        const prev    = data.sets[1]
        const trend   = prev && last?.kg && prev?.kg ? (last.kg > prev.kg ? '↑' : last.kg < prev.kg ? '↓' : '=') : null
        const tCol    = trend === '↑' ? '#22c55e' : trend === '↓' ? '#ef4444' : '#9ca3af'
        const rpeCol  = RPE_COLORS[String(last?.rpe)] || '#9ca3af'
        return (
          <div key={exId} className="bg-deep rounded-xl p-3 mb-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[13px] font-extrabold">{exData?.name || exId}</div>
              <div className="flex gap-2 items-center">
                {last?.rpe && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded"
                    style={{ background: rpeCol + '22', color: rpeCol, border: `1px solid ${rpeCol}44` }}>
                    RPE {last.rpe}
                  </span>
                )}
                {trend && <span className="text-[13px] font-extrabold" style={{ color: tCol }}>{trend}</span>}
              </div>
            </div>
            <div className="flex gap-3 text-[11px] text-soft">
              <span>Máx: <strong className="text-brand">{maxKg}kg</strong></span>
              <span>Último: <strong className="text-white">{last?.sets || '-'}×{last?.reps || '-'}</strong></span>
              <span>{data.sets.length} sesiones</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
