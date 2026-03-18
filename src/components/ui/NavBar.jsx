export default function NavBar({ tabs, active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-deep border-t border-mid z-40 flex justify-center">
      <div className="flex w-full max-w-[480px]">
        {tabs.map(tb => (
          <button
            key={tb.k}
            onClick={() => onChange(tb.k)}
            className={`nav-btn btn-tap ${active === tb.k ? 'active' : ''}`}
          >
            <div className="text-base leading-none mb-0.5">{tb.icon}</div>
            <div>{tb.lbl}</div>
          </button>
        ))}
      </div>
    </nav>
  )
}
