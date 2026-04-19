'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/dashboard` }
    })
    setSent(true)
  }

  if (sent) return (
    <div style={{padding:'2rem'}}>
      ✉️ Vérifie ton email — lien de connexion envoyé !
    </div>
  )

  return (
    <div style={{padding:'2rem', display:'flex', flexDirection:'column', gap:'1rem', maxWidth:'400px'}}>
      <h1>Connexion à AutoFacture</h1>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="ton@email.fr"
        style={{padding:'0.5rem', fontSize:'1rem'}}
      />
      <button
        onClick={handleLogin}
        style={{padding:'0.7rem', background:'#c8f55a', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'}}
      >
        Connexion sans mot de passe
      </button>
    </div>
  )
}