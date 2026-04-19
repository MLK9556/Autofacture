'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Factures() {
  const [factures, setFactures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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
        .from('factures')
        .select('*, clients(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setFactures(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const statutColor: any = {
    pending: { bg: 'rgba(245,166,35,0.1)', color: '#f5a623', label: 'En attente' },
    paid: { bg: 'rgba(77,219,138,0.1)', color: '#4ddb8a', label: 'Payée' },
    late: { bg: 'rgba(255,80,80,0.1)', color: '#ff6b6b', label: 'En retard' },
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
            <Link href="/factures" style={{ color: '#f5f5f5', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>Factures</Link>
            <Link href="/clients" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}>Clients</Link>
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
              Mes factures
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', margin: 0 }}>
              {factures.length} facture{factures.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <Link href="/dashboard" style={{
            background: '#c8f55a', color: '#0a0a0a',
            padding: '0.6rem 1.3rem', borderRadius: '8px',
            fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none'
          }}>
            + Nouvelle facture
          </Link>
        </div>

        {/* Liste */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '4rem' }}>Chargement...</div>
        ) : factures.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '5rem 2rem',
            background: '#111111', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
            <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Aucune facture pour l'instant</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Crée ta première facture et télécharge-la en PDF.
            </div>
            <Link href="/dashboard" style={{
              background: '#c8f55a', color: '#0a0a0a',
              padding: '0.7rem 1.5rem', borderRadius: '8px',
              fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none'
            }}>
              Créer une facture →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

            {/* Header tableau */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
              padding: '0.7rem 1.5rem',
              fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)',
              fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              <div>Numéro</div>
              <div>Client</div>
              <div>Montant</div>
              <div>Date</div>
              <div>Statut</div>
            </div>

            {factures.map((f, i) => {
              const s = statutColor[f.statut] || statutColor.pending
              return (
                <div key={f.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
                  padding: '1rem 1.5rem',
                  background: i % 2 === 0 ? '#111111' : '#0e0e0e',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: i === 0 ? '12px 12px 0 0' : i === factures.length - 1 ? '0 0 12px 12px' : '0',
                  alignItems: 'center'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{f.numero}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem' }}>
                    {f.clients?.nom || '—'}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>
                    {f.montant_ht ? `${(f.montant_ht * 1.2).toFixed(2)} €` : '—'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
                    {f.date_emission || '—'}
                  </div>
                  <div>
                    <span style={{
                      background: s.bg, color: s.color,
                      padding: '0.25rem 0.7rem', borderRadius: '100px',
                      fontSize: '0.72rem', fontWeight: '700'
                    }}>
                      {s.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}