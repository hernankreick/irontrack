/**
 * Chip de filtro. Usa color custom vía style para los colores dinámicos de IRON TRACK.
 */
export default function Chip({ label, icon, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn-tap px-3 py-1.5 rounded-full text-[12px] font-bold border whitespace-nowrap transition-all"
      style={{
        borderColor: active ? color : '#2d3748',
        background:  active ? color + '22' : '#0e1018',
        color:       active ? color : '#4a5568',
        fontFamily:  'inherit',
      }}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </button>
  )
}

/**
 * Fila horizontal scrolleable de chips.
 */
export function ChipRow({ children }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-3 [scrollbar-width:none]">
      {children}
    </div>
  )
}
