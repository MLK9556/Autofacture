'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError('Email ou mot de passe incorrect'); setLoading(false); return }
      router.push('/dashboard')
    }

    setLoading(false)
  }

  const handleMagicLink = async () => {
    if (!email) { setError('Entre ton email d\'abord'); return }
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })
    setMagicSent(true)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '9px',
    color: '#f5f5f5',
    fontSize: '0.92rem',
    boxSizing: 'border-box' as const,
    outline: 'none',
    fontFamily: 'inherit'
  }

  if (magicSent) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif', color: '#f5f5f5'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✉️</div>
        <h2 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Vérifie ton email</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          On a envoyé un lien de connexion à <strong style={{ color: '#f5f5f5' }}>{email}</strong>. Clique dessus pour accéder à ton dashboard.
        </p>
        <button onClick={() => setMagicSent(false)} style={{
          marginTop: '1.5rem', background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.85rem'
        }}>
          ← Retour
        </button>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif', color: '#f5f5f5',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            auto<span style={{ color: '#c8f55a' }}>facture</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
            {mode === 'login' ? 'Bon retour 👋' : 'Crée ton compte gratuit'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px', padding: '2rem'
        }}>

          {/* Toggle login/signup */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: '#0a0a0a', borderRadius: '8px',
            padding: '4px', marginBottom: '1.8rem'
          }}>
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                padding: '0.6rem',
                background: mode === m ? '#1a1a1a' : 'transparent',
                border: mode === m ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                borderRadius: '6px', cursor: 'pointer',
                color: mode === m ? '#f5f5f5' : 'rgba(255,255,255,0.3)',
                fontWeight: mode === m ? '700' : '500',
                fontSize: '0.85rem', fontFamily: 'inherit'
              }}>
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          {/* Champs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem', fontWeight: '600' }}>
                EMAIL
              </label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.fr"
                style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem', fontWeight: '600' }}>
                MOT DE PASSE
              </label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div style={{
              background: 'rgba(255,80,80,0.08)',
              border: '1px solid rgba(255,80,80,0.2)',
              borderRadius: '8px', padding: '0.7rem 1rem',
              fontSize: '0.82rem', color: '#ff6b6b',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {/* Bouton principal */}
          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '0.85rem',
            background: '#c8f55a', border: 'none',
            borderRadius: '9px', cursor: 'pointer',
            fontWeight: '800', fontSize: '0.95rem',
            color: '#0a0a0a', fontFamily: 'inherit',
            opacity: loading ? 0.7 : 1, marginBottom: '1rem'
          }}>
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>

          {/* Séparateur */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
          </div>

          {/* Magic Link */}
          <button onClick={handleMagicLink} disabled={loading} style={{
            width: '100%', padding: '0.75rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '9px', cursor: 'pointer',
            fontWeight: '600', fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.5)', fontFamily: 'inherit'
          }}>
            ✉️ Connexion par lien email
          </button>

        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', marginTop: '1.5rem' }}>
          En continuant, tu acceptes nos conditions d'utilisation.
        </p>

      </div>
    </div>
  )
}