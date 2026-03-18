import { SB_URL, SB_KEY } from '../constants/config'

const sbFetch = async (path, method="GET", body=null) => {
  const opts = { method, headers: { "apikey": SB_KEY, "Authorization": "Bearer "+SB_KEY, "Content-Type": "application/json", "Prefer": "return=representation" } };
  if(body) opts.body = JSON.stringify(body);
  const r = await fetch(SB_URL+"/rest/v1/"+path, opts);
  if(!r.ok) return null;
  const text = await r.text();
  return text ? JSON.parse(text) : null;
};

const sb = {
  getAlumnos: (entId) => sbFetch("alumnos?entrenador_id=eq."+entId+"&select=*"),
  createAlumno: (data) => sbFetch("alumnos", "POST", data),
  getRutinas: (alumnoId) => sbFetch("rutinas?alumno_id=eq."+alumnoId+"&select=*"),
  getRutinasByEntrenador: () => sbFetch("rutinas?entrenador_id=eq.entrenador_principal&select=*"),
  createRutina: (data) => sbFetch("rutinas", "POST", data),
  updateRutina: (id, data) => sbFetch("rutinas?id=eq."+id, "PATCH", data),
  deleteRutina: (id) => sbFetch("rutinas?id=eq."+id, "DELETE"),
  getProgreso: (alumnoId) => sbFetch("progreso?alumno_id=eq."+alumnoId+"&select=*&order=created_at.desc"),
  addProgreso: (data) => sbFetch("progreso", "POST", data),
  getSesiones: (alumnoId) => sbFetch("sesiones?alumno_id=eq."+alumnoId+"&select=*&order=created_at.desc&limit=10"),
  addSesion: (data) => sbFetch("sesiones", "POST", data),
  getUltimaSesion: (alumnoId) => sbFetch("sesiones?alumno_id=eq."+alumnoId+"&select=*&order=created_at.desc&limit=1"),
  getFotos: (alumnoId) => sbFetch("fotos?alumno_id=eq."+alumnoId+"&select=*&order=created_at.desc"),
  deleteFoto: (id) => sbFetch("fotos?id=eq."+id, "DELETE"),
  addFoto: (data) => sbFetch("fotos", "POST", data),
  updateAlumno: async (id, data) => {
    return sbFetch("alumnos?id=eq."+id, "PATCH", data);
  },
  getConfig: () => sbFetch("config?id=eq.pagos&select=*"),
  saveConfig: (data) => sbFetch("config?id=eq.pagos", "PATCH", data),
  getMensajes: (alumnoId) => sbFetch("mensajes?alumno_id=eq."+alumnoId+"&select=*&order=created_at.asc&limit=50"),
  addMensaje: (data) => sbFetch("mensajes", "POST", data),
};

export { sbFetch, sb }
