import { useEffect } from 'react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [message])

  if (!message) return null
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-surface border border-border2
                    text-white text-[15px] font-bold px-5 py-3 rounded-2xl shadow-xl max-w-[90vw]
                    animate-fade-in text-center">
      {message}
    </div>
  )
}
