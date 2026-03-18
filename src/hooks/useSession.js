import { useState } from 'react'
import { sb } from '../lib/supabase'
import { ENTRENADOR_EMAIL } from '../constants/config'

export function useSession() {
  const [sessionData, setSessionData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('it_session') || 'null') } catch { return null }
  })
  const [loginScreen, setLoginScreen] = useState(() => {
    try { return !localStorage.getItem('it_session') } catch { return true }
  })
  const [loginRole,    setLoginRole]    = useState('entrenador')
  const [loginEmail,   setLoginEmail]   = useState('')
  const [loginPass,    setLoginPass]    = useState('')
  const [loginError,   setLoginError]   = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const isEntrenador = sessionData?.role === 'entrenador' ||
    loginEmail.trim().toLowerCase() === ENTRENADOR_EMAIL

  const doLogin = async () => {
    setLoginLoading(true)
    setLoginError('')
    try {
      if (loginRole === 'entrenador') {
        // Login entrenador directo
        const data = { role: 'entrenador', email: loginEmail }
        localStorage.setItem('it_session', JSON.stringify(data))
        setSessionData(data)
        setLoginScreen(false)
      } else {
        // Login alumno via Supabase
        const alumnos = await sb.getAlumnos?.() || []
        const alumno = alumnos.find(
          a => a.email === loginEmail.trim() && a.pass === loginPass
        )
        if (!alumno) throw new Error('Email o clave incorrectos')
        const data = { role: 'alumno', alumnoId: alumno.id, nombre: alumno.nombre, email: loginEmail }
        localStorage.setItem('it_session', JSON.stringify(data))
        setSessionData(data)
        setLoginScreen(false)
      }
    } catch (e) {
      setLoginError(e.message || 'Error al iniciar sesion')
    } finally {
      setLoginLoading(false)
    }
  }

  const doLogout = () => {
    localStorage.removeItem('it_session')
    setSessionData(null)
    setLoginScreen(true)
    setLoginEmail('')
    setLoginPass('')
  }

  return {
    sessionData, loginScreen, loginRole, loginEmail, loginPass,
    loginError, loginLoading, isEntrenador,
    setLoginRole, setLoginEmail, setLoginPass,
    doLogin, doLogout,
  }
}
