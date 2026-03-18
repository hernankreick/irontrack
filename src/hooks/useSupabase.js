import { useState, useEffect } from 'react'
import { sb, sbFetch } from '../lib/supabase'
import { ENTRENADOR_ID } from '../constants/config'

/**
 * Hook que centraliza toda la comunicación con Supabase.
 * Recibe el rol y alumnoId actuales para saber qué cargar.
 */
export function useSupabase({ role, alumnoId }) {
  const [alumnos, setAlumnos]           = useState([])
  const [alumnoSesiones, setAlumnoSesiones] = useState([])
  const [alumnoProgreso, setAlumnoProgreso] = useState([])
  const [rutinasSB, setRutinasSB]       = useState([])
  const [loading, setLoading]           = useState(false)

  // ── Entrenador: cargar alumnos ──────────────────────────────────────
  const cargarAlumnos = async () => {
    const data = await sb.getAlumnos(ENTRENADOR_ID) || []
    setAlumnos(data)
  }

  useEffect(() => {
    if (role === 'entrenador') cargarAlumnos()
  }, [role])

  // ── Alumno: cargar rutinas desde SB ────────────────────────────────
  const cargarRutinasAlumno = async (id) => {
    try {
      const ruts = await sbFetch(
        `rutinas?alumno_id=eq.${id}&select=*&order=created_at.desc&limit=1`
      )
      if (ruts?.[0]?.datos) return { ...ruts[0].datos, alumnoId: id }
    } catch (e) {}
    return null
  }

  // ── Entrenador: cargar datos de un alumno específico ───────────────
  const cargarDatosAlumno = async (id) => {
    setLoading(true)
    try {
      const [sesiones, progreso, rutinas] = await Promise.all([
        sbFetch(`sesiones?alumno_id=eq.${id}&order=created_at.desc&limit=50`),
        sbFetch(`progreso?alumno_id=eq.${id}&order=created_at.desc`),
        sbFetch(`rutinas?alumno_id=eq.${id}&select=*&order=created_at.desc`),
      ])
      setAlumnoSesiones(sesiones || [])
      setAlumnoProgreso(progreso || [])
      setRutinasSB(rutinas || [])
    } catch (e) {
      console.error('Error cargando datos alumno:', e)
    } finally {
      setLoading(false)
    }
  }

  // ── Guardar sesión completada (alumno) ─────────────────────────────
  const guardarSesion = async (payload) => {
    try {
      await sb.addSesion(payload)
    } catch (e) {
      console.error('Error guardando sesion:', e)
    }
  }

  // ── Guardar rutina asignada a alumno ───────────────────────────────
  const guardarRutina = async (alumnoId, rutina) => {
    try {
      await sbFetch('rutinas', {
        method: 'POST',
        body: JSON.stringify({
          alumno_id: alumnoId,
          entrenador_id: ENTRENADOR_ID,
          datos: rutina,
        }),
      })
    } catch (e) {
      console.error('Error guardando rutina:', e)
    }
  }

  return {
    alumnos,
    setAlumnos,
    alumnoSesiones,
    alumnoProgreso,
    rutinasSB,
    loading,
    cargarAlumnos,
    cargarDatosAlumno,
    cargarRutinasAlumno,
    guardarSesion,
    guardarRutina,
  }
}
