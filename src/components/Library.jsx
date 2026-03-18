import { useState, useMemo } from 'react'
import { EX, PATS } from '../constants/exercises'
import Chip, { ChipRow } from './ui/Chip'
import Modal from './ui/Modal'

const PATRONES = ['todos', 'empuje', 'traccion', 'rodilla', 'bisagra', 'core', 'movilidad', 'cardio']
const MUSCULOS = ['todos', 'Cuadriceps', 'Gluteo', 'Isquios', 'Pecho', 'Dorsal', 'Hombro', 'Biceps', 'Triceps', 'Core', 'Pantorrilla']

const PAT_COLORS = {
  empuje: '#60a5fa', traccion: '#a78bfa', rodilla: '#4ade80',
  bisagra: '#f87171', core: '#facc15', movilidad: '#e879f9',
  cardio: '#22d3ee', movil: '#e879f9', pierna: '#4ade80',
}

export default function Library({ customEx, setCustomEx, toast2, es }) {
  const allEx = useMemo(() => [...EX, ...(customEx || [])], [customEx])

  const [tab, setTab]             = useState(0)
  const [busq, setBusq]           = useState('')
  const [filtPat, setFiltPat]     = useState('todos')
  const [filtMus, setFiltMus]     = useState('todos')
  const [modoFiltro, setModoFiltro] = useState('patron')
  const [editModal, setEditModal] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editYT, setEditYT]       = useState('')
  const [borrarId, setBorrarId]   = useState(null)

  // Form nuevo ejercicio
  const [newNombre, setNewNombre] = useState('')
  const [newPat, setNewPat]       = useState('empuje')
  const [newMus, setNewMus]       = useState('')
  const [newEquip, setNewEquip]   = useState('')
  const [newYT, setNewYT]         = useState('')

  // Detectar duplicados
  const counts = {}
  allEx.forEach(e => { counts[e.name.toLowerCase()] = (counts[e.name.toLowerCase()] || 0) + 1 })
  const dupCount = Object.values(counts).filter(v => v > 1).length

  const exFiltrados = allEx.filter(e => {
    const matchQ   = !busq || e.name.toLowerCase().includes(busq.toLowerCase())
    const matchPat = filtPat === 'todos' || e.pattern === filtPat
    const matchMus = filtMus === 'todos' || (e.muscle || '').toLowerCase().includes(filtMus.toLowerCase())
    return matchQ && (modoFiltro === 'patron' ? matchPat : matchMus)
  })

  const guardarEdicion = () => {
    if (!editNombre.trim()) { toast2('Ingresá un nombre'); return }
    const updated = customEx.map(e => e.id === editModal.id ? { ...e, name: editNombre, youtube: editYT } : e)
    setCustomEx(updated)
    localStorage.setItem('it_cex', JSON.stringify(updated))
    setEditModal(null)
    toast2('Ejercicio actualizado ✓')
  }

  const borrarEjercicio = (id) => {
    const updated = customEx.filter(e => e.id !== id)
    setCustomEx(updated)
    localStorage.setItem('it_cex', JSON.stringify(updated))
    setBorrarId(null)
    toast2('Ejercicio eliminado ✓')
  }

  const agregarEjercicio = () => {
    if (!newNombre.trim()) { toast2('Ingresá un nombre'); return }
    const newEx = {
      id: 'custom_' + Date.now(),
      name: newNombre, nameEn: newNombre,
      pattern: newPat, muscle: newMus,
      equip: newEquip || 'Libre', youtube: newYT,
    }
    const updated = [...(customEx || []), newEx]
    setCustomEx(updated)
    localStorage.setItem('it_cex', JSON.stringify(updated))
    setNewNombre(''); setNewPat('empuje'); setNewMus(''); setNewEquip(''); setNewYT('')
    setTab(0)
    toast2('Ejercicio agregado ✓')
  }

  const isValidYT = (url) => url && (url.includes('youtube') || url.includes('youtu.be'))

  return (
    <div>
      {/* Tabs GESTIONAR / + NUEVO */}
      <div className="flex border-b border-border mb-4">
        {['GESTIONAR', '+ NUEVO'].map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className="btn-tap flex-1 py-3 border-none bg-transparent font-bold text-[14px] tracking-wide"
            style={{ color: tab === i ? '#ef4444' : '#4a5568', borderBottom: tab === i ? '2px solid #ef4444' : '2px solid transparent' }}>
            {t}
            {i === 0 && dupCount > 0 && (
              <span className="ml-2 bg-brand text-white text-[11px] font-bold rounded-full px-1.5 py-0.5">
                {dupCount} dup
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── GESTIONAR ─────────────────────────────────────────────── */}
      {tab === 0 && (
        <div>
          <input className="input mb-3"
            placeholder="🔍 Buscar ejercicio..."
            value={busq}
            onChange={e => setBusq(e.target.value)} />

          {/* Toggle patron / músculo */}
          <div className="flex bg-deep border border-border rounded-xl p-1 mb-3">
            {[['patron', 'POR PATRÓN'], ['musculo', 'POR MÚSCULO']].map(([k, lbl]) => (
              <button key={k} onClick={() => { setModoFiltro(k); setFiltPat('todos'); setFiltMus('todos') }}
                className="btn-tap flex-1 py-2 rounded-lg border-none font-bold text-[13px] transition-colors"
                style={{ background: modoFiltro === k ? '#ef4444' : 'transparent', color: modoFiltro === k ? '#fff' : '#4a5568' }}>
                {lbl}
              </button>
            ))}
          </div>

          {/* Chips patrón */}
          {modoFiltro === 'patron' && (
            <ChipRow>
              {PATRONES.map(p => {
                const col = p === 'todos' ? '#ef4444' : (PAT_COLORS[p] || '#9ca3af')
                return (
                  <Chip key={p} label={p.toUpperCase()} color={col}
                    active={filtPat === p} onClick={() => setFiltPat(p)} />
                )
              })}
            </ChipRow>
          )}

          {/* Chips músculo */}
          {modoFiltro === 'musculo' && (
            <ChipRow>
              {MUSCULOS.map(m => (
                <Chip key={m} label={m.toUpperCase()} color="#60a5fa"
                  active={filtMus === m} onClick={() => setFiltMus(m)} />
              ))}
            </ChipRow>
          )}

          <div className="text-[12px] text-muted mb-3">
            Mostrando {exFiltrados.length} ejercicios de {allEx.length}
          </div>

          {/* Lista */}
          {exFiltrados.map(e => {
            const isDup    = counts[e.name.toLowerCase()] > 1
            const patCol   = PAT_COLORS[e.pattern] || '#9ca3af'
            const isCustom = !!(customEx || []).find(c => c.id === e.id)
            return (
              <div key={e.id} className="card mb-2"
                style={{ borderColor: isDup ? '#ef444444' : '#1a1d2e' }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <div className="text-[14px] font-extrabold">{e.name}</div>
                      {e.youtube && (
                        <a href={e.youtube} target="_blank" rel="noreferrer"
                          className="text-[11px] font-bold px-1.5 py-0.5 rounded text-brand"
                          style={{ background: '#ef444422', border: '1px solid #ef444433' }}>
                          ▶ VIDEO
                        </a>
                      )}
                      {isDup && (
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded text-brand"
                          style={{ background: '#ef444422', border: '1px solid #ef444433' }}>
                          DUP
                        </span>
                      )}
                      {isCustom && (
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: '#a78bfa22', color: '#a78bfa', border: '1px solid #a78bfa33' }}>
                          CUSTOM
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{ background: patCol + '22', color: patCol }}>
                        {e.pattern?.toUpperCase()}
                      </span>
                      {e.muscle && (
                        <span className="text-[11px] text-muted bg-border px-2 py-0.5 rounded">
                          {e.muscle}
                        </span>
                      )}
                    </div>
                  </div>
                  {isCustom && (
                    <div className="flex gap-2 shrink-0">
                      <button className="btn-tap border-none rounded-lg px-2.5 py-1.5 text-[13px] text-soft"
                        style={{ background: '#1a1d2e' }}
                        onClick={() => { setEditModal(e); setEditNombre(e.name); setEditYT(e.youtube || '') }}>
                        ✏️
                      </button>
                      <button className="btn-tap border-none rounded-lg px-2.5 py-1.5 text-[13px] text-brand"
                        style={{ background: '#ef444422' }}
                        onClick={() => setBorrarId(e.id)}>
                        🗑
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── NUEVO EJERCICIO ───────────────────────────────────────── */}
      {tab === 1 && (
        <div>
          <div className="text-[13px] text-soft mb-4">
            El ejercicio quedará disponible en toda la app.
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <div className="section-title">NOMBRE *</div>
            <input className="input" value={newNombre}
              onChange={e => setNewNombre(e.target.value)}
              placeholder="Ej: Press inclinado con mancuernas" />
          </div>

          {/* Patrón */}
          <div className="mb-4">
            <div className="section-title">PATRÓN</div>
            <div className="flex gap-2 flex-wrap">
              {['empuje', 'traccion', 'rodilla', 'bisagra', 'core', 'movilidad', 'cardio'].map(p => {
                const col = PAT_COLORS[p] || '#9ca3af'
                return (
                  <button key={p}
                    className="btn-tap border rounded-lg px-3 py-1.5 text-[13px] font-bold"
                    style={{
                      background: newPat === p ? col + '22' : '#0e1018',
                      color: newPat === p ? col : '#4a5568',
                      borderColor: newPat === p ? col + '66' : '#2d3748',
                    }}
                    onClick={() => setNewPat(p)}>
                    {p.toUpperCase()}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Músculo */}
          <div className="mb-4">
            <div className="section-title">MÚSCULO</div>
            <input className="input" value={newMus}
              onChange={e => setNewMus(e.target.value)}
              placeholder="Ej: Pecho, Triceps" />
          </div>

          {/* Equipamiento */}
          <div className="mb-4">
            <div className="section-title">EQUIPAMIENTO</div>
            <input className="input" value={newEquip}
              onChange={e => setNewEquip(e.target.value)}
              placeholder="Ej: Barra, Mancuernas, Libre" />
          </div>

          {/* YouTube */}
          <div className="mb-6">
            <div className="section-title">LINK YOUTUBE</div>
            <input className="input" value={newYT}
              onChange={e => setNewYT(e.target.value)}
              placeholder="https://youtube.com/..." />
            {isValidYT(newYT) && (
              <div className="flex items-center gap-3 mt-2 p-3 rounded-xl"
                style={{ background: '#0a0c14', border: '1px solid #1a1d2e' }}>
                <div className="w-12 h-8 rounded flex items-center justify-center text-brand"
                  style={{ background: '#ef444422' }}>▶</div>
                <div>
                  <div className="text-[12px] font-bold text-green-500">Link válido ✓</div>
                  <div className="text-[11px] text-muted">Se mostrará en la biblioteca</div>
                </div>
              </div>
            )}
          </div>

          <button className="btn-tap w-full py-4 bg-brand text-white border-none rounded-xl font-extrabold text-[16px] tracking-wide"
            onClick={agregarEjercicio}>
            + AGREGAR EJERCICIO
          </button>
        </div>
      )}

      {/* Modal editar */}
      {editModal && (
        <Modal onClose={() => setEditModal(null)}>
          <div className="text-[17px] font-extrabold mb-4">Editar ejercicio</div>
          <div className="mb-4">
            <div className="section-title">NOMBRE</div>
            <input className="input" value={editNombre} onChange={e => setEditNombre(e.target.value)} />
          </div>
          <div className="mb-6">
            <div className="section-title">LINK YOUTUBE</div>
            <input className="input" value={editYT}
              onChange={e => setEditYT(e.target.value)}
              placeholder="https://youtube.com/..." />
            {isValidYT(editYT) && (
              <div className="text-[12px] font-bold text-green-500 mt-2">▶ Link válido ✓</div>
            )}
          </div>
          <div className="flex gap-3">
            <button className="btn-tap flex-1 py-3 rounded-xl border-none font-bold text-soft text-[15px]"
              style={{ background: '#1a1d2e' }}
              onClick={() => setEditModal(null)}>CANCELAR</button>
            <button className="btn-tap flex-1 py-3 rounded-xl border-none font-bold text-white text-[15px] bg-brand"
              onClick={guardarEdicion}>GUARDAR</button>
          </div>
        </Modal>
      )}

      {/* Modal confirmar borrar */}
      {borrarId && (
        <Modal onClose={() => setBorrarId(null)}>
          <div className="text-center mb-5">
            <div className="text-[40px] mb-2">🗑️</div>
            <div className="text-[17px] font-extrabold mb-1">¿Borrar ejercicio?</div>
            <div className="text-[13px] text-soft">Esta acción no se puede deshacer</div>
          </div>
          <div className="flex gap-3">
            <button className="btn-tap flex-1 py-3 rounded-xl border-none font-bold text-soft text-[15px]"
              style={{ background: '#1a1d2e' }}
              onClick={() => setBorrarId(null)}>CANCELAR</button>
            <button className="btn-tap flex-1 py-3 rounded-xl border-none font-bold text-white text-[15px] bg-brand"
              onClick={() => borrarEjercicio(borrarId)}>BORRAR</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
