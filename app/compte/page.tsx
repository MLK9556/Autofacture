'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Compte() {
  const [profile, setProfile] = useState({
    nom: '',
    email: '',
    adresse: '',
    siret: '',
    tva_number: '',
    iban: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) setProfile(p => ({ ...p, ...data, email: user.email || '' }))
      else setProfile(p => ({ ...p, email: user.email || '' }))
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').upsert({
      id: user.id,
      nom: profile.nom,
      adresse: profile.adresse,
      siret: profile.siret,
      tva_number: profile.tva_number,
      iban: profile.iban,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '9px',
    color: '#f5f5f5',
    fontSize: '0.88rem',
    boxSizing: 'border-box' as const,
    outline: 'none',
    fontFamily: 'inherit'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '0.4rem',
    fontWeight: '600',
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const
  }

  const cardStyle = {
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '1.8rem'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>Chargement...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(20px)',
        background: 'rgba(10,10,10,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 2rem',
      }}>
        <div style={{
          maxWidth: '750px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '60px'
        }}>
          <Link href="/" style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '-0.02em', textDecoration: 'none', color: '#f5f5f5' }}>
            auto<span style={{ color: '#c8f55a' }}>facture</span>
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)',
              padding: '0.45rem 1rem', borderRadius: '7px',
              fontWeight: '600', fontSize: '0.8rem',
              cursor: 'pointer', fontFamily: 'inherit'
            }}>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '750px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.03em', margin: '0 0 0.3rem' }}>
            Mon compte
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', margin: 0 }}>
            Ces informations apparaîtront automatiquement sur tes factures.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Infos compte */}
          <div style={cardStyle}>
            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#c8f55a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '3px', height: '14px', background: '#c8f55a', borderRadius: '2px' }}></div>
              Informations de connexion
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={profile.email} disabled style={{ ...inputStyle, opacity: 0.4, cursor: 'not-allowed' }} />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.4rem', marginBottom: 0 }}>
                L'email ne peut pas être modifié.
              </p>
            </div>
          </div>

          {/* Infos entreprise */}
          <div style={cardStyle}>
            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#5ab4f5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '3px', height: '14px', background: '#5ab4f5', borderRadius: '2px' }}></div>
              Informations entreprise
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nom / Raison sociale</label>
                <input
                  value={profile.nom}
                  onChange={e => setProfile({ ...profile, nom: e.target.value })}
                  placeholder="Ex: Jean Dupont ou Dupont Consulting"
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Adresse complète</label>
                <input
                  value={profile.adresse}
                  onChange={e => setProfile({ ...profile, adresse: e.target.value })}
                  placeholder="12 rue de la Paix, 75001 Paris"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Numéro SIRET</label>
                <input
                  value={profile.siret}
                  onChange={e => setProfile({ ...profile, siret: e.target.value })}
                  placeholder="123 456 789 00012"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>N° TVA intracommunautaire</label>
                <input
                  value={profile.tva_number}
                  onChange={e => setProfile({ ...profile, tva_number: e.target.value })}
                  placeholder="FR 12 345678901"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Coordonnées bancaires */}
          <div style={cardStyle}>
            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#f5a623', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '3px', height: '14px', background: '#f5a623', borderRadius: '2px' }}></div>
              Coordonnées bancaires
            </div>
            <div>
              <label style={labelStyle}>IBAN</label>
              <input
                value={profile.iban}
                onChange={e => setProfile({ ...profile, iban: e.target.value })}
                placeholder="FR76 3000 6000 0112 3456 7890 189"
                style={inputStyle}
              />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.4rem', marginBottom: 0 }}>
                Apparaît en bas de chaque facture pour faciliter le paiement.
              </p>
            </div>
          </div>

          {/* Plan */}
          <div style={{
            background: 'rgba(200,245,90,0.04)',
            border: '1px solid rgba(200,245,90,0.1)',
            borderRadius: '14px', padding: '1.8rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#c8f55a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                Plan actuel
              </div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Gratuit</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>5 factures / mois</div>
            </div>
            <Link href="/pricing" style={{
              background: '#c8f55a', color: '#0a0a0a',
              padding: '0.6rem 1.3rem', borderRadius: '8px',
              fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none'
            }}>
              Passer Pro →
            </Link>
          </div>

          {/* Bouton save */}
          <button onClick={handleSave} disabled={saving} style={{
            padding: '0.9rem',
            background: saved ? 'rgba(200,245,90,0.15)' : '#c8f55a',
            border: saved ? '1px solid rgba(200,245,90,0.3)' : 'none',
            borderRadius: '10px', cursor: 'pointer',
            fontWeight: '800', fontSize: '0.95rem',
            color: saved ? '#c8f55a' : '#0a0a0a',
            fontFamily: 'inherit',
            opacity: saving ? 0.7 : 1,
            transition: 'all 0.2s'
          }}>
            {saving ? 'Enregistrement...' : saved ? '✓ Enregistré !' : 'Enregistrer les modifications'}
          </button>

        </div>
      </div>
    </div>
  )
}