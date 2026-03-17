export default function LoginForm({ loginRole, loginEmail, loginPass, loginError, loginLoading, onChangeRole, onChangeEmail, onChangePass, onLogin }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base px-6">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="text-[48px] font-black text-brand tracking-tighter leading-none">IRON</div>
        <div className="text-[48px] font-black tracking-tighter leading-none">TRACK</div>
        <div className="text-[13px] text-muted font-bold tracking-widest mt-1">TU ENTRENAMIENTO, TU PROGRESO</div>
      </div>

      {/* Toggle entrenador / alumno */}
      <div className="flex bg-surface border border-border rounded-xl p-1 mb-6 w-full max-w-sm">
        {['entrenador', 'alumno'].map(r => (
          <button key={r} onClick={() => onChangeRole(r)}
            className={`flex-1 py-2 rounded-lg text-[14px] font-bold btn-tap transition-colors ${
              loginRole === r ? 'bg-brand text-white' : 'text-muted'
            }`}>
            {r === 'entrenador' ? '🏋️ ENTRENADOR' : '💪 ALUMNO'}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="w-full max-w-sm space-y-3">
        <input className="input" type="email" placeholder="Email"
          value={loginEmail} onChange={e => onChangeEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Contraseña"
          value={loginPass} onChange={e => onChangePass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onLogin()} />
        {loginError && <div className="text-brand text-[13px] font-bold text-center">{loginError}</div>}
        <button onClick={onLogin} disabled={loginLoading}
          className="btn-tap w-full py-4 bg-brand text-white font-black text-[18px] rounded-xl border-none disabled:opacity-50">
          {loginLoading ? 'INGRESANDO...' : 'INGRESAR'}
        </button>
      </div>
    </div>
  )
}
