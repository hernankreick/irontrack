import { PATS } from '../constants/exercises'
import { WA_ENTRENADOR } from '../constants/config'

export default function PlanAlumno({
  routines, currentWeek, setCurrentWeek,
  setRoutines, session, setSession,
  allEx, progress, toast2, es,
}) {
  if (routines.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <div className="text-[48px] mb-3">📋</div>
        <div className="text-[20px] font-bold tracking-wide mb-2">
          {es ? 'Sin rutinas aún' : 'No routines yet'}
        </div>
        <div className="text-[15px]">
          {es ? 'Tu entrenador te asignará una rutina pronto' : 'Your trainer will assign a routine soon'}
        </div>
      </div>
    )
  }

  const pat = (pattern) =>
    PATS[pattern] || PATS['core'] || Object.values(PATS)[0] || { icon: '💪', color: '#9ca3af', label: 'Otro' }

  return (
    <div>
      {routines.map(r => (
        <div key={r.id}>
          {/* Cabecera */}
          <div className="mb-4">
            <div className="text-[27px] font-extrabold tracking-wide mb-1">{r.name}</div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[15px] text-muted">
                {r.created} · {r.days.length} {es ? 'días' : 'days'}
              </div>
              <div className="flex gap-2">
                <a
                  href={`${WA_ENTRENADOR}?text=${encodeURIComponent(es ? 'Hola! Te escribo desde IRON TRACK 💪' : 'Hi! Writing from IRON TRACK 💪')}`}
                  target="_blank" rel="noreferrer"
                  className="btn-tap flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold"
                  style={{ background: '#25d36622', color: '#25d366', border: '1px solid #25d36633' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M11.5 0C5.149 0 0 5.149 0 11.5c0 2.059.546 4.019 1.545 5.701L0 23l5.978-1.52A11.451 11.451 0 0011.5 23C17.851 23 23 17.851 23 11.5S17.851 0 11.5 0zm0 21.087a9.576 9.576 0 01-5.072-1.446l-.364-.217-3.548.902.918-3.453-.24-.378A9.567 9.567 0 011.913 11.5c0-5.289 4.299-9.587 9.587-9.587 5.289 0 9.587 4.298 9.587 9.587 0 5.288-4.298 9.587-9.587 9.587z"/>
                  </svg>
                  {es ? 'Contactar' : 'Contact'}
                </a>
              </div>
            </div>

            {/* Selector semana */}
            <div className="bg-[#0d0f18] rounded-xl p-3 border border-border flex items-center gap-3">
              <button
                className="btn-tap bg-border2 border-none rounded-lg w-9 h-9 text-[18px] font-bold"
                style={{ color: currentWeek > 0 ? '#e2e8f0' : '#374151' }}
                onClick={() => currentWeek > 0 && setCurrentWeek(w => w - 1)}
              >&lt;</button>
              <div className="flex-1 text-center">
                <div className="text-[13px] font-bold tracking-widest text-muted mb-0.5">
                  {es ? 'SEMANA' : 'WEEK'}
                </div>
                <div className="text-[32px] font-extrabold text-brand leading-none">
                  {currentWeek + 1} <span className="text-[18px] text-muted">/ 4</span>
                </div>
              </div>
              <button
                className="btn-tap bg-border2 border-none rounded-lg w-9 h-9 text-[18px] font-bold"
                style={{ color: currentWeek < 3 ? '#e2e8f0' : '#374151' }}
                onClick={() => currentWeek < 3 && setCurrentWeek(w => w + 1)}
              >&gt;</button>
            </div>
          </div>

          {/* Días */}
          {r.days.map((d, di) => (
            <div key={di} className="mb-5">
              <div className="text-[18px] font-bold tracking-wide text-soft mb-2 px-1">
                {es ? 'Día ' : 'Day '}{di + 1}
                {d.label && d.label !== `Dia ${di + 1}` ? ` — ${d.label}` : ''}
              </div>

              {/* Entrada en calor */}
              {(d.warmup || []).length > 0 && (
                <div className="mb-3">
                  <div
                    className="btn-tap flex items-center justify-between px-3 py-2 rounded-xl mb-2 cursor-pointer"
                    style={{ background: '#f9731611', border: '1px solid #f9731633' }}
                    onClick={() => setRoutines(p => p.map(r2 => r2.id === r.id ? {
                      ...r2, days: r2.days.map((dd, ddi) =>
                        ddi === di ? { ...dd, showWarmup: !dd.showWarmup } : dd
                      )
                    } : r2))}
                  >
                    <div className="flex items-center gap-2">
                      <span>🔥</span>
                      <span className="text-[16px] font-extrabold tracking-wide" style={{ color: '#f97316' }}>
                        {es ? 'ENTRADA EN CALOR' : 'WARM UP'}
                      </span>
                      <span className="text-[14px] font-bold" style={{ color: '#f9731699' }}>
                        ({(d.warmup || []).length})
                      </span>
                    </div>
                    <span className="text-[13px]" style={{ color: '#f97316' }}>{d.showWarmup ? '▲' : '▼'}</span>
                  </div>
                  {d.showWarmup && (d.warmup || []).map((ex, ei) => {
                    const info = allEx.find(e => e.id === ex.id)
                    const p    = pat(info?.pattern)
                    return (
                      <div key={ei} className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1.5"
                        style={{ background: '#f9731608', border: '1px solid #f9731622' }}>
                        <span className="text-[20px]">{p?.icon || '🔥'}</span>
                        <div className="flex-1">
                          <div className="text-[15px] font-bold">{info?.name || ex.id}</div>
                          {info?.youtube && (
                            <a href={info.youtube} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand mt-1"
                              style={{ background: '#ef444422', border: '1px solid #ef444433', borderRadius: 5, padding: '2px 7px' }}>
                              ▶ VIDEO
                            </a>
                          )}
                          {(ex.sets || ex.reps) && (
                            <div className="text-[12px] mt-0.5" style={{ color: '#f97316' }}>
                              {ex.sets && `${ex.sets} series`}{ex.reps && ` × ${ex.reps}`}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Bloque principal */}
              {d.exercises.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
                  style={{ background: '#ef444411', border: '1px solid #ef444433' }}>
                  <span>💪</span>
                  <span className="text-[16px] font-extrabold tracking-wide text-brand">
                    {es ? 'BLOQUE PRINCIPAL' : 'MAIN BLOCK'}
                  </span>
                  <span className="text-[14px] font-bold text-brand/60">({d.exercises.length})</span>
                </div>
              )}

              {d.exercises.map((ex, ei) => {
                const info  = allEx.find(e => e.id === ex.id)
                const p     = pat(info?.pattern)
                const col   = p?.color || '#60a5fa'
                const weeks = Array.from({ length: 4 }, (_, wi) => (ex.weeks || [])[wi] || {})
                return (
                  <div key={ei} className="rounded-xl p-4 mb-3"
                    style={{ background: '#0d0f18', border: `1px solid ${col}33` }}>
                    {/* Nombre + LOG */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[26px] shrink-0"
                        style={{ background: col + '15', border: `1px solid ${col}33` }}>
                        {p?.icon || '💪'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[22px] font-extrabold leading-tight" style={{ color: col }}>
                          {info?.name || ex.id}
                        </div>
                        {info?.youtube && (
                          <a href={info.youtube} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand mt-1"
                            style={{ background: '#ef444422', border: '1px solid #ef444433', borderRadius: 5, padding: '2px 7px' }}>
                            ▶ VER VIDEO
                          </a>
                        )}
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {ex.kg    && <span className="text-[12px] bg-border rounded px-2 py-0.5 text-soft">{ex.kg} kg</span>}
                          {ex.pause && <span className="text-[12px] bg-border rounded px-2 py-0.5 text-soft">⏱ {ex.pause}s</span>}
                        </div>
                      </div>
                      <button
                        className="btn-tap text-white border-none rounded-xl px-3 py-2 text-[13px] font-bold shrink-0"
                        style={{ background: col }}
                        onClick={() => setSession({ rId: r.id, dIdx: di, exIdx: ei, startTime: Date.now() })}
                      >
                        LOG
                      </button>
                    </div>

                    {/* 4 semanas */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {weeks.map((w, wi) => {
                        const active = wi === currentWeek
                        const s      = w.sets || ex.sets || '-'
                        const rp     = w.reps || ex.reps || '-'
                        const kg2    = w.kg || ex.kg || ''
                        const filled = w.sets || w.reps || w.kg
                        return (
                          <div key={wi} className="rounded-xl p-2 text-center"
                            style={{ background: active ? col + '18' : '#13151f', border: `1px solid ${active ? col + '55' : '#1a1d2e'}` }}>
                            <div className="text-[10px] font-bold tracking-wider mb-0.5"
                              style={{ color: active ? col : '#4a5568', fontSize: active ? 11 : 9 }}>
                              S{wi + 1}
                            </div>
                            <div className="font-extrabold"
                              style={{ fontSize: active ? 18 : 14, color: active ? '#fff' : filled ? '#e2e8f0' : '#374151' }}>
                              {s}×{rp}
                            </div>
                            {kg2 && <div className="font-bold mt-0.5"
                              style={{ fontSize: active ? 14 : 12, color: col }}>{kg2}kg</div>}
                            {w.note && <div className="text-[11px] text-muted mt-0.5 truncate">{w.note}</div>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Botón iniciar sesión */}
              <button
                className="btn-tap w-full mt-2 py-3 rounded-xl font-extrabold text-[16px] tracking-wide border-none"
                style={{ background: '#4ade8022', color: '#4ade80', border: '1px solid #4ade8033' }}
                onClick={() => {
                  setSession({ rId: r.id, dIdx: di, exIdx: 0, startTime: Date.now() })
                  toast2('💪 Sesión iniciada!')
                }}
              >
                {es ? 'INICIAR SESIÓN' : 'START SESSION'}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
