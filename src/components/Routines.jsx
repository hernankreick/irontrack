import { useState } from 'react'
import { PATS } from '../constants/exercises'
import { sb } from '../lib/supabase'
import Chip, { ChipRow } from './ui/Chip'

const fmtP = s => {
  const n = parseInt(s) || 0
  if (!n) return 'No'
  if (n < 60) return n + 's'
  const m = Math.floor(n / 60), r = n % 60
  return r ? `${m}m ${r}s` : `${m}m`
}

const pat = (pattern) =>
  PATS[pattern] || PATS['core'] || Object.values(PATS)[0] || { icon: '💪', color: '#9ca3af', label: 'Otro' }

export default function Routines({ routines, setRoutines, alumnos, allEx, toast2, es }) {
  const [filtro, setFiltro] = useState('todas')

  const uid = () => Math.random().toString(36).slice(2, 9)

  const filtradas = routines.filter(r => {
    if (filtro === 'app')  return !r.scanned
    if (filtro === 'scan') return !!r.scanned
    return true
  })

  const addRoutine = () => {
    const r = {
      id: uid(), name: es ? 'Nueva Rutina' : 'New Routine',
      created: new Date().toLocaleDateString('es-AR'),
      days: [{ label: 'Día 1', exercises: [], warmup: [] }],
    }
    setRoutines(p => [r, ...p])
  }

  const removeRoutine = (id) => setRoutines(p => p.filter(r => r.id !== id))

  const addDay = (rId) => setRoutines(p => p.map(r => r.id === rId ? {
    ...r, days: [...r.days, { label: `Día ${r.days.length + 1}`, exercises: [], warmup: [] }]
  } : r))

  const moveEx = (rId, di, bloque, fromIdx, toIdx) => {
    setRoutines(p => p.map(r => r.id === rId ? {
      ...r, days: r.days.map((dd, ddi) => {
        if (ddi !== di) return dd
        const arr = [...(dd[bloque] || [])]
        const [item] = arr.splice(fromIdx, 1)
        arr.splice(toIdx, 0, item)
        return { ...dd, [bloque]: arr }
      })
    } : r))
  }

  const removeEx = (rId, di, bloque, ei) => setRoutines(p => p.map(r => r.id === rId ? {
    ...r, days: r.days.map((dd, ddi) => ddi !== di ? dd : {
      ...dd, [bloque]: (dd[bloque] || []).filter((_, i) => i !== ei)
    })
  } : r))

  const toggleBlock = (rId, di, blk) => setRoutines(p => p.map(r => r.id === rId ? {
    ...r, days: r.days.map((dd, ddi) => ddi !== di ? dd : { ...dd, [blk]: !dd[blk] })
  } : r))

  const saveRoutine = async (r) => {
    try {
      const payload = {
        nombre: r.name, alumno_id: r.alumno_id || null,
        datos: { days: r.days, alumno: r.alumno, name: r.name, created: r.created }
      }
      if (r.saved) { await sb.updateRutina(r.id, payload) }
      else {
        await sb.createRutina({ ...payload, id: r.id })
        setRoutines(p => p.map(rr => rr.id === r.id ? { ...rr, saved: true } : rr))
      }
      toast2(es ? 'Rutina guardada ✓' : 'Routine saved ✓')
    } catch (e) { toast2('Error al guardar') }
  }

  const ExRow = ({ ex, ei, rId, di, bloque, exList }) => {
    const info   = allEx.find(e => e.id === ex.id)
    const p      = pat(info?.pattern)
    const canUp  = ei > 0
    const canDown = ei < exList.length - 1
    return (
      <div className="rounded-xl p-2.5 mb-2" style={{ background: '#13151f', border: '1px solid #1a1d2e' }}>
        <div className="flex items-center gap-2 mb-1">
          {/* Flechas orden */}
          <div className="flex flex-col gap-0.5 shrink-0">
            <button className="btn-tap border-none rounded text-[12px] w-6 h-5 flex items-center justify-center"
              style={{ background: canUp ? '#1a1d2e' : '#0a0c14', color: canUp ? '#e2e8f0' : '#374151' }}
              onClick={() => canUp && moveEx(rId, di, bloque, ei, ei - 1)}>↑</button>
            <button className="btn-tap border-none rounded text-[12px] w-6 h-5 flex items-center justify-center"
              style={{ background: canDown ? '#1a1d2e' : '#0a0c14', color: canDown ? '#e2e8f0' : '#374151' }}
              onClick={() => canDown && moveEx(rId, di, bloque, ei, ei + 1)}>↓</button>
          </div>
          <span className="text-[20px]">{p?.icon || '?'}</span>
          <span className="text-[15px] font-bold flex-1">{info?.name || ex.id}</span>
          <button className="btn-tap border-none rounded-lg px-2 py-1 text-[12px] text-soft" style={{ background: '#1a1d2e' }}
            onClick={() => { /* TODO: edit ex modal */ }}>✏️</button>
          <button className="btn-tap border-none rounded-lg px-2 py-1 text-[12px] text-brand" style={{ background: '#ef444422' }}
            onClick={() => removeEx(rId, di, bloque, ei)}>✕</button>
        </div>
        <div className="flex gap-3 flex-wrap pl-8 text-[14px] text-soft">
          {ex.kg && <span>{ex.kg}kg</span>}
          <span>{fmtP(ex.pause)}</span>
        </div>
        {(ex.weeks || []).length > 0 && (
          <div className="flex gap-1.5 mt-1.5 overflow-x-auto pl-8">
            {ex.weeks.map((w, wi) => (
              <div key={wi} className="bg-deep rounded px-2 py-1 shrink-0 text-[12px]">
                <span className="font-bold" style={{ color: p?.color }}>S{wi + 1}</span> {w.sets}×{w.reps}{w.kg ? ` ${w.kg}kg` : ''}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Filtros */}
      <ChipRow>
        {[['todas', 'TODAS', null], ['app', '✏️ APP', null], ['scan', '📷 ESCANEADAS', null]].map(([k, lbl]) => (
          <Chip key={k} label={lbl} color="#ef4444" active={filtro === k} onClick={() => setFiltro(k)} />
        ))}
      </ChipRow>

      <button
        className="btn-tap w-full mb-3 py-3 rounded-xl font-extrabold text-[16px] tracking-wide border-none text-white"
        style={{ background: '#ef4444' }}
        onClick={addRoutine}
      >
        + {es ? 'NUEVA RUTINA' : 'NEW ROUTINE'}
      </button>

      {filtradas.map(r => (
        <div key={r.id} className="card mb-3">
          {/* Header rutina */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-[20px] font-bold">{r.name}</div>
                {r.scanned && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded"
                    style={{ background: '#60a5fa22', color: '#60a5fa', border: '1px solid #60a5fa44' }}>
                    📷 SCAN
                  </span>
                )}
              </div>
              {r.alumno && <div className="text-[15px] font-bold text-brand mt-0.5">👤 {r.alumno}</div>}
              <div className="text-[14px] text-muted">{r.days.length} {es ? 'días' : 'days'}</div>
            </div>
            <button className="btn-tap border-none rounded-lg px-3 py-1.5 text-[13px] font-bold text-brand"
              style={{ background: '#ef444422' }}
              onClick={() => removeRoutine(r.id)}>🗑️</button>
          </div>

          {/* Asignar alumno + guardar */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <select
              className="flex-1 min-w-[120px] bg-deep border border-border2 rounded-lg px-3 py-2 text-white text-[14px]"
              value={r.alumno_id || ''}
              onChange={e => {
                const v = e.target.value
                setRoutines(p => p.map(rr => rr.id === r.id ? {
                  ...rr, alumno_id: v,
                  alumno: alumnos.find(a => a.id === v)?.nombre || ''
                } : rr))
              }}>
              <option value="">👤 Sin asignar</option>
              {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            <button className="btn-tap border-none rounded-lg px-4 py-2 text-[14px] font-bold text-green-500"
              style={{ background: '#22c55e22' }}
              onClick={() => saveRoutine(r)}>
              💾 {es ? 'Guardar' : 'Save'}
            </button>
          </div>

          {/* Días */}
          {r.days.map((d, di) => {
            const hasWarmup = (d.warmup || []).length > 0
            return (
              <div key={di} className="border-l-2 border-border pl-3 mb-3">
                <div className="text-[17px] font-bold text-muted mb-2 tracking-wide">
                  {d.label || `${es ? 'Día' : 'Day'} ${di + 1}`}
                </div>

                {/* Entrada en calor */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px]">🔥</span>
                      <span className="text-[15px] font-extrabold tracking-wide" style={{ color: '#f97316' }}>
                        {es ? 'ENTRADA EN CALOR' : 'WARM UP'}
                      </span>
                      {hasWarmup && <span className="text-[13px] text-soft font-bold">({(d.warmup || []).length})</span>}
                    </div>
                    <div className="flex gap-1.5">
                      <button className="btn-tap border-none rounded-lg px-2.5 py-1 text-[12px] font-bold"
                        style={{ background: '#f9731622', color: '#f97316' }}
                        onClick={() => { /* TODO: add ex modal warmup */ }}>+ Agregar</button>
                      {hasWarmup && (
                        <button className="btn-tap border-none rounded-lg px-2.5 py-1 text-[12px] font-bold text-soft"
                          style={{ background: '#1a1d2e' }}
                          onClick={() => toggleBlock(r.id, di, 'showWarmup')}>
                          {d.showWarmup ? '▲' : '▼'}
                        </button>
                      )}
                    </div>
                  </div>
                  {d.showWarmup && hasWarmup && (d.warmup || []).map((ex, ei) => (
                    <ExRow key={ei} ex={ex} ei={ei} rId={r.id} di={di} bloque="warmup" exList={d.warmup} />
                  ))}
                  {!hasWarmup && <div className="text-[12px] text-[#374151] py-1">Sin ejercicios — agregá uno</div>}
                </div>

                {/* Bloque principal */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px]">💪</span>
                      <span className="text-[15px] font-extrabold tracking-wide text-brand">
                        {es ? 'BLOQUE PRINCIPAL' : 'MAIN BLOCK'}
                      </span>
                      <span className="text-[13px] text-soft font-bold">({d.exercises.length})</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="btn-tap border-none rounded-lg px-2.5 py-1 text-[12px] font-bold text-green-500"
                        style={{ background: '#4ade8022' }}
                        onClick={() => { /* TODO: add ex modal */ }}>+ Agregar</button>
                      {d.exercises.length > 0 && (
                        <button className="btn-tap border-none rounded-lg px-2.5 py-1 text-[12px] font-bold text-soft"
                          style={{ background: '#1a1d2e' }}
                          onClick={() => toggleBlock(r.id, di, 'showMain')}>
                          {d.showMain !== false ? '▲' : '▼'}
                        </button>
                      )}
                    </div>
                  </div>
                  {d.showMain !== false && d.exercises.map((ex, ei) => (
                    <ExRow key={ei} ex={ex} ei={ei} rId={r.id} di={di} bloque="exercises" exList={d.exercises} />
                  ))}
                  {d.exercises.length === 0 && <div className="text-[12px] text-[#374151] py-1">Sin ejercicios — agregá uno</div>}
                </div>
              </div>
            )
          })}

          <button className="btn-tap w-full py-2 rounded-lg text-[14px] font-bold text-muted border-none mt-1"
            style={{ background: '#1a1d2e' }}
            onClick={() => addDay(r.id)}>
            + {es ? 'Agregar día' : 'Add day'}
          </button>
        </div>
      ))}
    </div>
  )
}
