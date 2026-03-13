import { useState, useEffect, useMemo } from 'react'
import { EX } from './constants/exercises'
import { ENTRENADOR_ID } from './constants/config'
import { useSession }  from './hooks/useSession'
import { useSupabase } from './hooks/useSupabase'
import { sb } from './lib/supabase'

import NavBar        from './components/ui/NavBar'
import Toast         from './components/ui/Toast'
import LoginForm     from './components/LoginForm'
import Dashboard     from './components/Dashboard'
import PlanAlumno    from './components/PlanAlumno'
import LibraryAlumno from './components/LibraryAlumno'
import Routines      from './components/Routines'
import Progress      from './components/Progress'
import Alumnos       from './components/Alumnos'
import Library       from './components/Library'

const Placeholder = ({ label }) => (
  <div className="text-center py-16 text-muted">
    <div className="text-[40px] mb-3">🚧</div>
    <div className="text-[16px] font-bold">{label} — próximamente</div>
  </div>
)

export default function App() {
  const {
    sessionData, loginScreen, loginRole, loginEmail, loginPass,
    loginError, loginLoading, isEntrenador,
    setLoginRole, setLoginEmail, setLoginPass,
    doLogin,
  } = useSession()

  const esAlumno = !isEntrenador
  const [tab, setTab] = useState('plan')
  const es = true

  const TABS_ENTRENADOR = [
    { k: 'plan',       icon: '📅', lbl: 'PLAN'  },
    { k: 'routines',   icon: '📋', lbl: 'RUT'   },
    { k: 'scanner',    icon: '📷', lbl: 'SCAN'  },
    { k: 'biblioteca', icon: '📚', lbl: 'BIBL'  },
    { k: 'progress',   icon: '📊', lbl: 'PROG'  },
    { k: 'alumnos',    icon: '👥', lbl: 'ALUM'  },
  ]
  const TABS_ALUMNO = [
    { k: 'plan',    icon: '📅', lbl: 'PLAN' },
    { k: 'library', icon: '📚', lbl: 'BIBL' },
    { k: 'progress',icon: '📊', lbl: 'PROG' },
  ]
  const tabs = esAlumno ? TABS_ALUMNO : TABS_ENTRENADOR

  const [routines, setRoutines] = useState(() => {
    try { return JSON.parse(localStorage.getItem('it_rt') || '[]') } catch { return [] }
  })
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('it_pg') || '{}') } catch { return {} }
  })
  const [customEx, setCustomEx] = useState(() => {
    try { return JSON.parse(localStorage.getItem('it_cex') || '[]') } catch { return [] }
  })
  const [currentWeek, setCurrentWeek] = useState(() => {
    try { return parseInt(localStorage.getItem('it_week') || '0') } catch { return 0 }
  })
  const [completedDays, setCompletedDays] = useState(() => {
    try { return JSON.parse(localStorage.getItem('it_cd') || '[]') } catch { return [] }
  })
  const [session, setSession]             = useState(null)
  const [toast, setToast]                 = useState(null)

  const [alumnoActivo, setAlumnoActivo]         = useState(null)
  const [rutinasSB, setRutinasSB]               = useState([])
  const [alumnoProgreso, setAlumnoProgreso]     = useState([])
  const [alumnoSesiones, setAlumnoSesiones]     = useState([])
  const [loadingSB, setLoadingSB]               = useState(false)
  const [newAlumnoForm, setNewAlumnoForm]       = useState(false)
  const [newAlumnoData, setNewAlumnoData]       = useState({ nombre: '', email: '', pass: '' })
  const [editAlumnoModal, setEditAlumnoModal]   = useState(null)

  const { alumnos, setAlumnos } = useSupabase({
    role: sessionData?.role,
    alumnoId: sessionData?.alumnoId,
  })

  const urlParams   = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const sharedParam = urlParams?.get('r')
  const readOnly    = !!sharedParam

  useEffect(() => {
    if (sharedParam) {
      try {
        const decoded = JSON.parse(atob(sharedParam))
        if (decoded?.id) setRoutines([decoded])
      } catch {}
    }
  }, [])

  useEffect(() => { if (!readOnly) localStorage.setItem('it_rt',   JSON.stringify(routines))      }, [routines])
  useEffect(() => {                localStorage.setItem('it_pg',   JSON.stringify(progress))      }, [progress])
  useEffect(() => {                localStorage.setItem('it_week', String(currentWeek))           }, [currentWeek])
  useEffect(() => {                localStorage.setItem('it_cd',   JSON.stringify(completedDays)) }, [completedDays])

  useEffect(() => {
    if (!readOnly && sessionData?.role === 'alumno' && sessionData?.alumnoId) {
      (async () => {
        try {
          const ruts = await sb.getRutinas?.(sessionData.alumnoId)
          if (ruts?.[0]?.datos) setRoutines([{ ...ruts[0].datos, alumnoId: sessionData.alumnoId }])
        } catch {}
      })()
    }
  }, [sessionData?.role])

  const allEx  = useMemo(() => [...EX, ...customEx], [customEx])
  const toast2 = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  if (loginScreen) {
    return (
      <LoginForm
        loginRole={loginRole} loginEmail={loginEmail} loginPass={loginPass}
        loginError={loginError} loginLoading={loginLoading}
        onChangeRole={setLoginRole} onChangeEmail={setLoginEmail} onChangePass={setLoginPass}
        onLogin={doLogin}
      />
    )
  }

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-base relative">
      <Toast message={toast} onClose={() => setToast(null)} />

      <div className="overflow-y-auto h-screen pb-[70px] px-4 pt-4">

        {tab === 'plan' && !esAlumno && (
          <Dashboard
            alumnos={alumnos}
            sesiones={alumnoSesiones}
            onChatAlumno={() => setTab('alumnos')}
          />
        )}

        {tab === 'plan' && esAlumno && (
          <PlanAlumno
            routines={routines}
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
            setRoutines={setRoutines}
            session={session}
            setSession={setSession}
            allEx={allEx}
            progress={progress}
            toast2={toast2}
            es={es}
          />
        )}

        {tab === 'routines' && !esAlumno && (
          <Routines
            routines={routines}
            setRoutines={setRoutines}
            alumnos={alumnos}
            allEx={allEx}
            toast2={toast2}
            es={es}
          />
        )}

        {tab === 'scanner' && !esAlumno && <Placeholder label="Scanner IA" />}

        {tab === 'biblioteca' && !esAlumno && (
          <Library
            customEx={customEx}
            setCustomEx={setCustomEx}
            toast2={toast2}
            es={es}
          />
        )}

        {tab === 'library' && esAlumno && (
          <LibraryAlumno allEx={allEx} es={es} />
        )}

        {tab === 'progress' && (
          <Progress
            progress={progress}
            es={es}
          />
        )}

        {tab === 'alumnos' && !esAlumno && (
          <Alumnos
            alumnos={alumnos}
            setAlumnos={setAlumnos}
            routines={routines}
            setRoutines={setRoutines}
            alumnoActivo={alumnoActivo}
            setAlumnoActivo={setAlumnoActivo}
            rutinasSB={rutinasSB}
            setRutinasSB={setRutinasSB}
            alumnoProgreso={alumnoProgreso}
            setAlumnoProgreso={setAlumnoProgreso}
            alumnoSesiones={alumnoSesiones}
            setAlumnoSesiones={setAlumnoSesiones}
            newAlumnoForm={newAlumnoForm}
            setNewAlumnoForm={setNewAlumnoForm}
            newAlumnoData={newAlumnoData}
            setNewAlumnoData={setNewAlumnoData}
            editAlumnoModal={editAlumnoModal}
            setEditAlumnoModal={setEditAlumnoModal}
            loadingSB={loadingSB}
            setLoadingSB={setLoadingSB}
            toast2={toast2}
            es={es}
            ENTRENADOR_ID={ENTRENADOR_ID}
          />
        )}

      </div>

      <NavBar tabs={tabs} active={tab} onChange={setTab} />
    </div>
  )
}
