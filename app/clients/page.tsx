'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Clients() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', adresse: '', siret: '' })
  const [saving, setSaving] = useState(false)
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
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setClients(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!form.nom) return
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('clients')
      .insert({ ...form, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setClients(c => [data, ...c])
      setForm({ nom: '', email: '', adresse: '', siret: '' })
      setShowForm(false)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce client ?')) return
    await supabase.from('clients').delete().eq('id', id)
    setClients(c => c.filter(x => x.id !== id))
  }

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.9rem',
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#f5f5f5',
    fontSize: '0.88rem',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '0.4rem',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em'
  }

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
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <Link href="/" style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '-0.02em', textDecoration: 'none', color: '#f5f5f5' }}>
            auto<span style={{ color: '#c8f55a' }}>facture</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>Nouvelle facture</Link>
            <Link href="/factures" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>Factures</Link>
            <Link href="/compte" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>Mon compte</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.03em', margin: '0 0 0.3rem' }}>Mes clients</h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', margin: 0 }}>{clients.length} client{clients.length > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: '#c8f55a', color: '#0a0a0a',
              padding: '0.6rem 1.2rem', borderRadius: '8px',
              fontWeight: '700', fontSize: '0.85rem',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            + Nouveau client
          </button>
        </div>

        {/* Formulaire ajout */}
        {showForm && (
          <div style={{ background: '#111111', border: '1px solid rgba(200,245,90,0.15)', borderRadius: '14px', padding: '1.8rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#c8f55a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
              Nouveau client
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {[
                { label: 'Nom / Entreprise *', name: 'nom' },
                { label: 'Email', name: 'email' },
                { label: 'Adresse', name: 'adresse' },
                { label: 'SIRET', name: 'siret' },
              ].map(f => (
                <div key={f.name}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    value={(form as any)[f.name]}
                    onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button onClick={handleSave} disabled={saving} style={{
                background: '#c8f55a', color: '#0a0a0a',
                padding: '0.7rem 1.5rem', borderRadius: '8px',
                fontWeight: '700', fontSize: '0.88rem',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                opacity: saving ? 0.7 : 1
              }}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button onClick={() => setShowForm(false)} style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.4)',
                padding: '0.7rem 1.5rem', borderRadius: '8px',
                fontWeight: '600', fontSize: '0.88rem',
                cursor: 'pointer', fontFamily: 'inherit'
              }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.2)' }}>Chargement...</div>
        ) : clients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#111111', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👥</div>
            <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Aucun client pour l'instant</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Ajoute ton premier client pour le retrouver rapidement</div>
            <button onClick={() => setShowForm(true)} style={{
              background: '#c8f55a', color: '#0a0a0a',
              padding: '0.7rem 1.5rem', borderRadius: '8px',
              fontWeight: '700', fontSize: '0.88rem',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit'
            }}>
              Ajouter un client →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {clients.map(c => (
              <div key={c.id} style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '1.2rem 1.5rem',
                display: 'flex', alignItems: 'center', gap: '1.5rem'
              }}>

                {/* Avatar */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(200,245,90,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: '800', color: '#c8f55a', flexShrink: 0
                }}>
                  {c.nom?.[0]?.toUpperCase()}
                </div>

                {/* Infos */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '0.2rem' }}>{c.nom}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
                    {c.email || '—'} {c.siret ? `· SIRET ${c.siret}` : ''}
                  </div>
                </div>

                {/* Adresse */}
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', flex: 1 }}>
                  {c.adresse || '—'}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/dashboard?client=${c.id}`} style={{
                    background: 'rgba(200,245,90,0.06)',
                    border: '1px solid rgba(200,245,90,0.15)',
                    color: '#c8f55a', padding: '0.35rem 0.7rem',
                    borderRadius: '6px', fontSize: '0.78rem',
                    fontWeight: '600', textDecoration: 'none'
                  }}>
                    + Facture
                  </Link>
                  <button onClick={() => handleDelete(c.id)} style={{
                    background: 'rgba(255,95,95,0.06)',
                    border: '1px solid rgba(255,95,95,0.15)',
                    color: '#ff5f5f', padding: '0.35rem 0.7rem',
                    borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.78rem', fontFamily: 'inherit'
                  }}>
                    ✕
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}