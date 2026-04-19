'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Clients() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nom: '', email: '', adresse: '', siret: '' })
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
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

  const handleAdd = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from('clients').insert({
      user_id: user.id,
      nom: form.nom,
      email: form.email,
      adresse: form.adresse,
      siret: form.siret,
    }).select().single()

    if (data) setClients([data, ...clients])
    setForm({ nom: '', email: '', adresse: '', siret: '' })
    setShowForm(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('clients').delete().eq('id', id)
    setClients(clients.filter(c => c.id !== id))
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
          maxWidth: '1000px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '60px'
        }}>
          <Link href="/" style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '-0.02em', textDecoration: 'none', color: '#f5f5f5' }}>
            auto<span style={{ color: '#c8f55a' }}>facture</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}>Dashboard</Link>
            <Link href="/factures" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}>Factures</Link>
            <Link href="/clients" style={{ color: '#f5f5f5', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>Clients</Link>
            <Link href="/compte" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}>Mon compte</Link>
            <Link href="/pricing" style={{
              background: '#c8f55a', color: '#0a0a0a',
              padding: '0.45rem 1rem', borderRadius: '7px',
              fontWeight: '700', fontSize: '0.8rem', textDecoration: 'none'
            }}>
              Passer Pro →
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.03em', margin: '0 0 0.3rem' }}>
              Mes clients
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', margin: 0 }}>
              {clients.length} client{clients.length > 1 ? 's' : ''} enregistré{clients.length > 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: '#c8f55a', color: '#0a0a0a',
            padding: '0.6rem 1.3rem', borderRadius: '8px',
            fontWeight: '700', fontSize: '0.85rem',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit'
          }}>
            + Ajouter un client
          </button>
        </div>

        {/* Formulaire ajout */}
        {showForm && (
          <div style={{
            background: '#111111', border: '1px solid rgba(200,245,90,0.15)',
            borderRadius: '14px', padding: '1.8rem', marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#c8f55a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
              Nouveau client
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {[
                { label: 'Nom / Entreprise', key: 'nom', placeholder: 'Acme Corp' },
                { label: 'Email', key: 'email', placeholder: 'contact@acme.fr' },
                { label: 'Adresse', key: 'adresse', placeholder: '12 rue de la Paix, Paris' },
                { label: 'SIRET', key: 'siret', placeholder: '123 456 789 00012' },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button onClick={handleAdd} disabled={saving || !form.nom} style={{
                background: '#c8f55a', color: '#0a0a0a',
                padding: '0.65rem 1.3rem', borderRadius: '8px',
                fontWeight: '700', fontSize: '0.85rem',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                opacity: !form.nom ? 0.5 : 1
              }}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button onClick={() => setShowForm(false)} style={{
                background: 'transparent', color: 'rgba(255,255,255,0.4)',
                padding: '0.65rem 1.3rem', borderRadius: '8px',
                fontWeight: '600', fontSize: '0.85rem',
                border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontFamily: 'inherit'
              }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste clients */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '4rem' }}>Chargement...</div>
        ) : clients.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '5rem 2rem',
            background: '#111111', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
            <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Aucun client pour l'instant</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
              Ajoute tes clients pour les retrouver rapidement sur chaque facture.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {clients.map((c, i) => (
              <div key={c.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto',
                padding: '1rem 1.5rem',
                background: i % 2 === 0 ? '#111111' : '#0e0e0e',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: i === 0 ? '12px 12px 0 0' : i === clients.length - 1 ? '0 0 12px 12px' : '0',
                alignItems: 'center', gap: '1rem'
              }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{c.nom}</div>
                  {c.siret && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.2rem' }}>SIRET: {c.siret}</div>}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{c.email || '—'}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{c.adresse || '—'}</div>
                <button onClick={() => handleDelete(c.id)} style={{
                  background: 'rgba(255,80,80,0.08)',
                  border: '1px solid rgba(255,80,80,0.15)',
                  color: '#ff6b6b', padding: '0.35rem 0.7rem',
                  borderRadius: '6px', cursor: 'pointer',
                  fontSize: '0.75rem', fontWeight: '600', fontFamily: 'inherit'
                }}>
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}