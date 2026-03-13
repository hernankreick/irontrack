import { useState } from 'react'
import Avatar from './ui/Avatar'
import Modal from './ui/Modal'

const ALUMNOS_MOCK = [
  { id: 1, nombre: 'Agustin G.',  avatar: 'AG', color: '#22c55e', pct: 90,  dias: null },
  { id: 2, nombre: 'Maria R.',    avatar: 'MR', color: '#60a5fa', pct: 100, dias: null },
  { id: 3, nombre: 'Lucas G.',    avatar: 'LG', color: '#ef4444', pct: 30,  dias: 3 },
  { id: 4, nombre: 'Sofia M.',    avatar: 'SO', color: '#f59e0b', pct: 75,  dias: null },
  { id: 5, nombre: 'Paula C.',    avatar: 'PC', color: '#ef4444', pct: 0,   dias: 5 },
]

const PRS_MOCK = [
  { alumno: 'Agustin G.', ejercicio: 'Press Banca',  nuevo: '95 kg', anterior: '90 kg', mejora: '+5 kg',  fecha: 'Lun 10/03', hist: [{d:'10/03',v:95,pr:true},{d:'08/03',v:92},{d:'03/03',v:90},{d:'24/02',v:87.5}] },
  { alumno: 'Sofia M.',   ejercicio: 'Sentadilla',    nuevo: '80 kg', anterior: '75 kg', mejora: '+5 kg',  fecha: 'Mar 11/03', hist: [{d:'11/03',v:80,pr:true},{d:'08/03',v:77.5},{d:'01/03',v:75}] },
  { alumno: 'Maria R.',   ejercicio: 'Peso Muerto',   nuevo: '70 kg', anterior: '65 kg', mejora: '+5 kg',  fecha: 'Mie 12/03', hist: [{d:'12/03',v:70,pr:true},{d:'09/03',v:67.5},{d:'02/03',v:65}] },
]

const ACTIVIDAD_MOCK = [
  { nombre: 'Agustin G.', avatar: 'AG', color: '#22c55e', texto: 'completó sesión',  sub: '7 ejercicios · RPE 8 · 1 PR 🏆', hace: '2h',   warn: false },
  { nombre: 'Maria R.',   avatar: 'MR', color: '#60a5fa', texto: 'completó sesión',  sub: '6 ejercicios · RPE 7',            hace: '4h',   warn: false },
  { nombre: 'Lucas G.',   avatar: 'LG', color: '#ef4444', texto: 'sin actividad',    sub: '3 días sin entrenar ⚠️',          hace: 'hoy',  warn: true  },
  { nombre: 'Sofia M.',   avatar: 'SO', color: '#f59e0b', texto: 'nuevo PR 🏆',      sub: 'Sentadilla 80kg',                 hace: 'ayer', warn: false },
]

export default function Dashboard({ alumnos = [], sesiones = [], onChatAlumno }) {
  const [modalPR, setModalPR] = useState(null)

  const totalAlumnos   = alumnos.length || 18
  const sinEntrenar    = ALUMNOS_MOCK.filter(a => a.dias)
  const adherenciaMock = ALUMNOS_MOCK

  const StatBox = ({ value, label, color }) => (
    <div className="bg-surface rounded-xl p-3 text-center border" style={{ borderColor: color + '33' }}>
      <div className="text-[30px] font-black" style={{ color }}>{value}</div>
      <div className="text-[10px] font-bold text-muted whitespace-pre-line leading-tight mt-1">{label}</div>
    </div>
  )

  return (
    <div className="pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pt-1">
        <div>
          <div className="text-[13px] font-bold text-muted tracking-widest">BUEN DIA</div>
          <div className="text-[26px] font-black">HERNAN 👋</div>
        </div>
        <div className="bg-brand/10 border border-brand/20 rounded-xl px-4 py-2 text-center">
          <div className="text-[24px] font-black text-brand">{totalAlumnos}</div>
          <div className="text-[10px] font-bold text-muted">ALUMNOS</div>
        </div>
      </div>

      {/* Stats semana */}
      <p className="section-title">ESTA SEMANA</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        <StatBox value={sesiones?.length || 42} label={"ENTRENA-\nMIENTOS"} color="#22c55e" />
        <StatBox value={7}   label={"PRs\nNUEVOS"}    color="#f59e0b" />
        <StatBox value="94%" label={"ADHEREN-\nCIA"}  color="#60a5fa" />
      </div>

      {/* Adherencia */}
      <p className="section-title">ADHERENCIA POR ALUMNO</p>
      <div className="card p-0 mb-4">
        {adherenciaMock.map((a, i) => (
          <div key={a.id} className="row" style={{ borderBottom: i < adherenciaMock.length - 1 ? undefined : 'none' }}>
            <Avatar nombre={a.nombre} color={a.color} />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-extrabold">{a.nombre}</div>
              <div className="h-1.5 bg-border rounded mt-1.5 overflow-hidden">
                <div className="h-full rounded transition-all" style={{ width: a.pct + '%', background: a.color }} />
              </div>
            </div>
            <div className="text-[14px] font-extrabold ml-2 shrink-0" style={{ color: a.color }}>{a.pct}%</div>
          </div>
        ))}
      </div>

      {/* Actividad reciente */}
      <p className="section-title">ACTIVIDAD RECIENTE</p>
      <div className="card p-0 mb-4">
        {ACTIVIDAD_MOCK.map((a, i) => (
          <div key={i} className="row" style={{ borderBottom: i < ACTIVIDAD_MOCK.length - 1 ? undefined : 'none' }}>
            <Avatar nombre={a.nombre} color={a.color} />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-extrabold">{a.nombre} — {a.texto}</div>
              <div className={`text-[12px] ${a.warn ? 'text-red-500' : 'text-muted'}`}>{a.sub}</div>
            </div>
            <div className="text-[11px] text-muted shrink-0">{a.hace}</div>
          </div>
        ))}
      </div>

      {/* Sin entrenar */}
      {sinEntrenar.length > 0 && (
        <>
          <p className="section-title text-brand">⚠️ SIN ENTRENAR +3 DÍAS</p>
          <div className="card p-0 mb-4" style={{ borderColor: '#ef444433' }}>
            {sinEntrenar.map((a, i) => (
              <div key={a.id} className="row" style={{ borderBottom: i < sinEntrenar.length - 1 ? undefined : 'none' }}>
                <Avatar nombre={a.nombre} color={a.color} />
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-extrabold">{a.nombre}</div>
                  <div className="text-[12px] text-muted">Último entreno: hace {a.dias} días</div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); onChatAlumno?.(a) }}
                  className="btn-tap bg-brand text-white border-none rounded-lg px-3 py-1.5 text-[14px] font-bold shrink-0"
                >
                  💬
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PRs semana */}
      <p className="section-title" style={{ color: '#f59e0b' }}>🏆 PRs ESTA SEMANA</p>
      <div className="card p-0" style={{ borderColor: '#f59e0b33' }}>
        {PRS_MOCK.map((pr, i) => (
          <div key={i} className="row" onClick={() => setModalPR(pr)}
            style={{ borderBottom: i < PRS_MOCK.length - 1 ? undefined : 'none' }}>
            <span className="text-[22px]">🏆</span>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-extrabold">{pr.alumno} — {pr.ejercicio}</div>
              <div className="text-[12px] text-muted">{pr.nuevo} · antes {pr.anterior}</div>
            </div>
            <div className="text-[13px] font-extrabold text-green-500 shrink-0">{pr.mejora}</div>
          </div>
        ))}
      </div>

      {/* Modal PR */}
      {modalPR && (
        <Modal onClose={() => setModalPR(null)}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[30px]">🏆</span>
            <div>
              <div className="text-[20px] font-black">{modalPR.ejercicio}</div>
              <div className="text-[13px] text-muted">{modalPR.alumno} · {modalPR.fecha}</div>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4 flex justify-around text-center">
            {[['NUEVO', modalPR.nuevo, '#f59e0b'], ['ANTERIOR', modalPR.anterior, '#9ca3af'], ['MEJORA', modalPR.mejora, '#22c55e']].map(([l, v, c]) => (
              <div key={l}>
                <div className="text-[11px] text-muted font-bold tracking-widest">{l}</div>
                <div className="text-[22px] font-black" style={{ color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <p className="section-title">PROGRESIÓN</p>
          {modalPR.hist.map((h, i) => {
            const max = Math.max(...modalPR.hist.map(x => x.v))
            return (
              <div key={i} className="flex items-center gap-3 mb-2">
                <div className="text-[12px] text-muted w-11 shrink-0">{h.d}</div>
                <div className="flex-1 h-2 bg-border rounded overflow-hidden">
                  <div className="h-full rounded" style={{ width: Math.round((h.v / max) * 100) + '%', background: h.pr ? '#f59e0b' : '#2d3748' }} />
                </div>
                <div className="text-[13px] font-extrabold w-14 text-right shrink-0" style={{ color: h.pr ? '#f59e0b' : '#9ca3af' }}>
                  {h.v} {h.pr ? '🏆' : ''}
                </div>
              </div>
            )
          })}
          <button onClick={() => setModalPR(null)} className="btn-tap w-full mt-3 py-3 bg-border2 text-soft rounded-xl font-bold text-[15px] border-none">
            Cerrar
          </button>
        </Modal>
      )}
    </div>
  )
}
