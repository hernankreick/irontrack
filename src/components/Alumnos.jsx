import { useState } from 'react'
import { sb } from '../lib/supabase'
import { EX } from '../constants/exercises'
import Avatar from './ui/Avatar'

const RPE_COLORS = { '6': '#22c55e', '7': '#84cc16', '8': '#eab308', '9': '#f97316', '10': '#ef4444' }

const SUBTABS = ['Esta semana', 'Historial', 'Por ejercicio']

export default function Alumnos({
  alumnos, setAlumnos, routines, setRoutines,
  alumnoActivo, setAlumnoActivo,
  rutinasSB, setRutinasSB,
  alumnoProgreso, setAlumnoProgreso,
  alumnoSesiones, setAlumnoSesiones,
  newAlumnoForm, setNewAlumnoForm,
  newAlumnoData, setNewAlumnoData,
  editAlumnoModal, setEditAlumnoModal,
  loadingSB, setLoadingSB,
  toast2, es,
  ENTRENADOR_ID,
}) {
  const [subTab, setSubTab] = useState(0)

  const cargarAlumno = async (a) => {
    setAlumnoActivo(a)
    setSubTab(0)
    setLoadingSB(true)
    const [ruts, prog, ses] = await Promise.all([
      sb.getRutinas(a.id),
      sb.getProgreso(a.id),
      sb.getSesiones(a.id),
    ])
    setRutinasSB(ruts || [])
    setAlumnoProgreso(prog || [])
    setAlumnoSesiones(ses || [])
    setLoadingSB(false)
  }

  const crearAlumno = async () => {
    if (!newAlumnoData.nombre.trim() || !newAlumnoData.email.trim()) return
    setLoadingSB(true)
    const res = await sb.createAlumno({
      nombre: newAlumnoData.nombre.trim(),
      email: newAlumnoData.email.trim(),
      pass: newAlumnoData.pass,
      entrenador_id: ENTRENADOR_ID,
    })
    if (res?.[0]) {
      setAlumnos(prev => [...prev, res[0]])
      toast2('Alumno creado: ' + newAlumnoData.nombre + ' ✓')
      setNewAlumnoForm(false)
      setNewAlumnoData({ nombre: '', email: '', pass: '' })
    } else { toast2('Error al crear alumno') }
    setLoadingSB(false)
  }

  // Alertas vencimiento
  const porVencer = alumnos.filter(a => {
    const r = routines.find(rt => rt.alumnoId === a.id)
    if (!r?.endDate) return false
    const days = Math.ceil((new Date(r.endDate) - new Date()) / 86400000)
    return days <= 7 && days >= 0
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[20px] font-extrabold tracking-wide">👥 {es ? 'MIS ALUMNOS' : 'MY ATHLETES'}</div>
        <div className="flex gap-2">
          <button className="btn-tap border-none rounded-xl px-3 py-1.5 text-[13px] font-bold text-green-500"
            style={{ background: '#22c55e22' }}
            onClick={() => setNewAlumnoForm(f => !f)}>
            + {es ? 'Nuevo' : 'New'}
          </button>
          <button className="btn-tap border-none rounded-xl px-3 py-1.5 text-[13px] font-bold text-soft"
            style={{ background: '#1a1d2e' }}
            onClick={() => { /* TODO: refresh */ }}>
            🔄
          </button>
        </div>
      </div>

      {/* Alertas vencimiento */}
      {porVencer.length > 0 && (
        <div className="rounded-xl p-3 mb-4" style={{ background: '#f9731611', border: '1px solid #f9731644' }}>
          <div className="text-[13px] font-extrabold text-orange-400 mb-2">⚠️ PLANES POR VENCER</div>
          {porVencer.map(a => {
            const r    = routines.find(rt => rt.alumnoId === a.id)
            const days = Math.ceil((new Date(r.endDate) - new Date()) / 86400000)
            const tel  = a.telefono || ''
            return (
              <div key={a.id} className="flex items-center justify-between mb-1">
                <div>
                  <div className="text-[14px] font-bold">{a.nombre}</div>
                  <div className="text-[12px] text-orange-400">
                    {days === 0 ? 'Vence hoy' : `Vence en ${days} días`}
                  </div>
                </div>
                {tel && (
                  <a href={`https://wa.me/549${tel}?text=${encodeURIComponent('Hola ' + a.nombre + '! Tu plan vence pronto.')}`}
                    target="_blank" rel="noreferrer"
                    className="btn-tap border-none rounded-lg px-3 py-1.5 text-[12px] font-bold"
                    style={{ background: '#25d36622', color: '#25d366' }}>
                    WA
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Form nuevo alumno */}
      {newAlumnoForm && (
        <div className="card mb-4">
          <div className="text-[14px] font-bold tracking-wide mb-3">NUEVO ALUMNO</div>
          {[['NOMBRE', 'text', 'nombre'], ['EMAIL', 'email', 'email'], ['CONTRASEÑA', 'password', 'pass']].map(([lbl, type, key]) => (
            <div key={key} className="mb-3">
              <div className="text-[11px] font-bold tracking-widest text-muted mb-1">{lbl}</div>
              <input type={type} className="input"
                value={newAlumnoData[key]}
                onChange={e => setNewAlumnoData(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex gap-2">
            <button className="btn-tap flex-1 py-2.5 rounded-xl border-none font-bold text-soft text-[15px]"
              style={{ background: '#1a1d2e' }}
              onClick={() => setNewAlumnoForm(false)}>CANCELAR</button>
            <button className="btn-tap flex-2 py-2.5 rounded-xl border-none font-bold text-white text-[15px] bg-brand"
              onClick={crearAlumno} disabled={loadingSB}>GUARDAR</button>
          </div>
        </div>
      )}

      {loadingSB && <div className="text-center text-muted py-5">Cargando...</div>}

      {alumnos.length === 0 && !loadingSB && (
        <div className="text-center py-10 text-muted">
          <div className="text-[36px] mb-2">👥</div>
          <div className="text-[15px] font-bold">{es ? 'Sin alumnos aún' : 'No athletes yet'}</div>
        </div>
      )}

      {/* Lista alumnos */}
      {alumnos.map(a => (
        <div key={a.id} className="card mb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Avatar nombre={a.nombre} color="#ef4444" />
              <div>
                <div className="text-[17px] font-bold">{a.nombre}</div>
                <div className="text-[13px] text-soft">{a.email}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-tap border border-border2 rounded-lg px-2.5 py-1.5 text-[13px] text-soft bg-surface"
                onClick={() => { setEditAlumnoModal(a) }}>✏️</button>
              <button className="btn-tap border-none rounded-lg px-3 py-1.5 text-[13px] font-bold text-brand"
                style={{ background: '#ef444422' }}
                onClick={() => alumnoActivo?.id === a.id ? setAlumnoActivo(null) : cargarAlumno(a)}>
                {alumnoActivo?.id === a.id ? 'CERRAR' : 'VER'}
              </button>
            </div>
          </div>

          {/* Panel expandido */}
          {alumnoActivo?.id === a.id && (
            <div className="pt-2 border-t border-border">
              {/* Rutinas */}
              <div className="text-[12px] font-bold text-muted tracking-wide mb-2">RUTINAS</div>
              {rutinasSB.map(r => (
                <div key={r.id} className="bg-deep rounded-xl p-3 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[14px] font-bold">{r.nombre}</div>
                    <div className="flex gap-2">
                      <button className="btn-tap border-none rounded-lg px-2.5 py-1 text-[13px]"
                        style={{ background: '#25d36622', color: '#25d366' }}
                        onClick={async () => {
                          const link = window.location.href.split('?')[0] + '?r=' + btoa(JSON.stringify({ ...r.datos, alumnoId: a.id }))
                          if (navigator.share) navigator.share({ title: r.nombre, url: link })
                          else { navigator.clipboard?.writeText(link); toast2('Link copiado ✓') }
                        }}>📤</button>
                      <button className="btn-tap border-none rounded-lg px-2.5 py-1 text-[13px] text-brand"
                        style={{ background: '#ef444422' }}
                        onClick={async () => {
                          await sb.deleteRutina(r.id)
                          setRutinasSB(prev => prev.filter(x => x.id !== r.id))
                          toast2('Rutina eliminada')
                        }}>🗑</button>
                    </div>
                  </div>
                  <div className="text-[11px] text-muted">{r.datos?.days?.length || 0} días</div>
                </div>
              ))}

              {/* Progreso */}
              {alumnoProgreso.length > 0 && (
                <div className="mt-3">
                  <div className="text-[12px] font-bold text-muted tracking-wide mb-2">PROGRESO</div>
                  {/* Sub-tabs */}
                  <div className="flex gap-1.5 mb-3">
                    {SUBTABS.map((t, ti) => (
                      <button key={ti} className="btn-tap flex-1 py-1.5 rounded-lg border-none text-[12px] font-bold"
                        style={{ background: subTab === ti ? '#ef4444' : '#1a1d2e', color: subTab === ti ? '#fff' : '#4a5568' }}
                        onClick={() => setSubTab(ti)}>{t}</button>
                    ))}
                  </div>

                  {/* Esta semana */}
                  {subTab === 0 && alumnoProgreso.slice(0, 15).map((p, pi) => {
                    const exData = EX.find(e => e.id === p.ejercicio_id)
                    const rpeCol = RPE_COLORS[String(p.rpe)] || '#9ca3af'
                    return (
                      <div key={pi} className="bg-base rounded-xl p-2.5 mb-1.5 flex items-center gap-2">
                        <div className="flex-1">
                          <div className="text-[13px] font-extrabold">{exData?.name || p.ejercicio_id}</div>
                          <div className="text-[11px] text-soft">
                            {p.sets || '-'}×{p.reps || '-'}{p.kg ? ` · ${p.kg}kg` : ''}
                          </div>
                        </div>
                        {p.rpe && <span className="text-[11px] font-bold px-2 py-0.5 rounded"
                          style={{ background: rpeCol + '22', color: rpeCol, border: `1px solid ${rpeCol}44` }}>
                          RPE {p.rpe}
                        </span>}
                        <div className="text-[11px] text-muted shrink-0">{p.fecha}</div>
                      </div>
                    )
                  })}

                  {/* Historial por sesión */}
                  {subTab === 1 && (() => {
                    const byF = {}
                    alumnoProgreso.forEach(p => { if (!byF[p.fecha]) byF[p.fecha] = []; byF[p.fecha].push(p) })
                    return Object.keys(byF).sort((a, b) => b.localeCompare(a)).slice(0, 10).map(fecha => {
                      const sets = byF[fecha]
                      const rpeProm = sets.filter(s => s.rpe).length
                        ? Math.round(sets.reduce((a, b) => a + (b.rpe || 0), 0) / sets.filter(s => s.rpe).length) : null
                      const rpeCol = rpeProm >= 9 ? '#ef4444' : rpeProm >= 7 ? '#eab308' : '#22c55e'
                      return (
                        <div key={fecha} className="bg-base rounded-xl p-2.5 mb-1.5">
                          <div className="flex justify-between mb-0.5">
                            <div className="text-[13px] font-extrabold">{fecha}</div>
                            <span className="text-[11px] font-bold text-green-500">{sets.length} registros</span>
                          </div>
                          {rpeProm && <div className="text-[12px] text-soft">
                            RPE prom: <strong style={{ color: rpeCol }}>{rpeProm}</strong>
                          </div>}
                        </div>
                      )
                    })
                  })()}

                  {/* Por ejercicio */}
                  {subTab === 2 && (() => {
                    const byEx = {}
                    alumnoProgreso.forEach(p => { if (!byEx[p.ejercicio_id]) byEx[p.ejercicio_id] = { sets: [] }; byEx[p.ejercicio_id].sets.push(p) })
                    return Object.entries(byEx).slice(0, 8).map(([exId, data]) => {
                      const exData = EX.find(e => e.id === exId)
                      const maxKg  = Math.max(...data.sets.map(s => s.kg || 0))
                      const last   = data.sets[0]
                      const prev   = data.sets[1]
                      const trend  = prev && last?.kg && prev?.kg ? (last.kg > prev.kg ? '↑' : last.kg < prev.kg ? '↓' : '=') : null
                      const tCol   = trend === '↑' ? '#22c55e' : trend === '↓' ? '#ef4444' : '#9ca3af'
                      return (
                        <div key={exId} className="bg-base rounded-xl p-2.5 mb-1.5">
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="text-[13px] font-extrabold">{exData?.name || exId}</div>
                            <div className="flex gap-2">
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
                    })
                  })()}
                </div>
              )}

              {/* Sesiones recientes */}
              {alumnoSesiones.length > 0 && (
                <div className="mt-3">
                  <div className="text-[12px] font-bold text-muted tracking-wide mb-2">SESIONES RECIENTES</div>
                  {alumnoSesiones.slice(0, 5).map((s, i) => (
                    <div key={i} className="bg-base rounded-xl p-2.5 mb-1.5 flex justify-between">
                      <div>
                        <div className="text-[13px] font-bold text-green-500">✅ {s.dia_label} - Sem {s.semana}</div>
                        <div className="text-[11px] text-muted">{s.fecha} · {s.hora}</div>
                      </div>
                      <div className="text-[11px] text-muted text-right">{s.rutina_nombre}</div>
                    </div>
                  ))}
                  {alumnoSesiones[0] && (() => {
                    const hoy = new Date().toLocaleDateString('es-AR')
                    const entrenoHoy = alumnoSesiones[0].fecha === hoy
                    return (
                      <div className="text-[13px] font-bold mt-1" style={{ color: entrenoHoy ? '#22c55e' : '#f59e0b' }}>
                        {entrenoHoy ? '🟢 Entrenó hoy' : '🟡 Último entreno: ' + alumnoSesiones[0].fecha}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Asignar rutina */}
              <button className="btn-tap w-full mt-3 py-2.5 rounded-xl border-none font-bold text-[14px]"
                style={{ background: '#60a5fa22', color: '#60a5fa' }}
                onClick={async () => {
                  const rutinaLocal = routines[0]
                  if (!rutinaLocal) { toast2('Creá una rutina primero en RUTINAS'); return }
                  setLoadingSB(true)
                  const res = await sb.createRutina({
                    alumno_id: a.id, entrenador_id: ENTRENADOR_ID,
                    nombre: rutinaLocal.name,
                    datos: { days: rutinaLocal.days, name: rutinaLocal.name }
                  })
                  if (res?.[0]) { setRutinasSB(prev => [...prev, res[0]]); toast2('Rutina asignada ✓') }
                  else { toast2('Error al asignar rutina') }
                  setLoadingSB(false)
                }}>
                + Asignar rutina actual
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
