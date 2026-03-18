export default function Avatar({ nombre = '', color = '#ef4444', size = 'md' }) {
  const initials = nombre.slice(0, 2).toUpperCase()
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div
      className={`avatar btn-tap shrink-0 font-black ${sizes[size]}`}
      style={{ background: color + '22', color }}
    >
      {initials}
    </div>
  )
}
