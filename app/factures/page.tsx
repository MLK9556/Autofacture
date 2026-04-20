'use client'
import { useEffect, useState, Suspense } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { generateFacturePDF } from '@/lib/generatePDF'

function FacturesContent() {
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

  const handleStatut = async (id: string, statut: string) => {
    await supabase.from('factures').update({ statut }).eq('id', id)
    setFactures(f => f.map(x => x.id === id ? { ...x, statut } : x))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette facture ?')) return
    await supabase.from('factures').delete().eq('id', id)
    setFactures(f => f.filter(x => x.id !== id))
  }

  const handleRegenPDF = (f: any) => {
    generateFacturePDF({
      numero: f.numero,
      date_emission: f.date_emission,
      date_echeance: f.date_echeance,
      from: { nom: '', adresse: '', siret: '', email: '' },
      to: { nom: f.clients?.nom || '', adresse: f.clients?.adresse || '' },
      lignes: f.lignes || [],
      tva_pct: f.tva_pct,
      notes: f.notes
    })
  }

  const statutColor = (s: string) => {
    if (s === 'paid') return '#4ddb8a'
    if (s === 'pending') return '#f5a623'
    return '#ff5f5f'
  }

  const statutLabel = (s: string) => {
    if (s === 'paid') return 'Payée'
    if (s === 'pending') return 'En attente'
    return 'En retard'
  }

  const totalCA = factures.filter(f => f.statut === 'paid').reduce((s, f) => s + (f.montant_ht * 1.2), 0)
  const totalImpaye = factures.filter(f => f.statut !== 'paid').reduce((s, f) => s + (f.montant_ht * 1.2), 0)

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
            <Link href="/clients" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>Clients</Link>
            <Link href="/compte" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>Mon compte</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.03em', margin: '0 0 0.3rem' }}>Mes factures</h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', margin: 0 }}>{factures.length} facture{factures.length > 1 ? 's' : ''}</p>
          </div>
          <Link href="/dashboard" style={{
            background: '#c8f55a', color: '#0a0a0a',
            padding: '0.6rem 1.2rem', borderRadius: '8px',
            fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none'
          }}>
            + Nouvelle facture
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Factures totales', value: factures.length, color: 'rgba(255,255,255,0.4)' },
            { label: 'CA encaissé', value: `${totalCA.toFixed(0)} €`, color: '#4ddb8a' },
            { label: 'Impayés', value: `${totalImpaye.toFixed(0)} €`, color: '#f5a623' },
          ].map(s => (
            <div key={s.label} style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.3rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Liste */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.2)' }}>Chargement...</div>
        ) : factures.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#111111', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
            <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Aucune facture pour l'instant</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Crée ta première facture en 30 secondes</div>
            <Link href="/dashboard" style={{ background: '#c8f55a', color: '#0a0a0a', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem', textDecoration: 'none' }}>
              Créer une facture →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {factures.map(f => (
              <div key={f.id} style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

                {/* Numéro + date */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '0.2rem' }}>{f.numero}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
                    {f.date_emission} · échéance {f.date_echeance || '—'}
                  </div>
                </div>

                {/* Client */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{f.clients?.nom || '—'}</div>
                </div>

                {/* Montant */}
                <div style={{ textAlign: 'right', minWidth: '90px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{(f.montant_ht * 1.2).toFixed(2)} €</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>TTC</div>
                </div>

                {/* Statut */}
                <select
                  value={f.statut}
                  onChange={e => handleStatut(f.id, e.target.value)}
                  style={{
                    background: `${statutColor(f.statut)}15`,
                    border: `1px solid ${statutColor(f.statut)}40`,
                    color: statutColor(f.statut),
                    padding: '0.35rem 0.7rem', borderRadius: '100px',
                    fontSize: '0.75rem', fontWeight: '700',
                    cursor: 'pointer', fontFamily: 'inherit'
                  }}
                >
                  <option value="pending">En attente</option>
                  <option value="paid">Payée</option>
                  <option value="late">En retard</option>
                </select>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleRegenPDF(f)} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)', padding: '0.35rem 0.7rem',
                    borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit'
                  }}>
                    ⬇ PDF
                  </button>
                  <button onClick={() => handleDelete(f.id)} style={{
                    background: 'rgba(255,95,95,0.06)', border: '1px solid rgba(255,95,95,0.15)',
                    color: '#ff5f5f', padding: '0.35rem 0.7rem',
                    borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit'
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

export default function Factures() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>Chargement...</div>}>
      <FacturesContent />
    </Suspense>
  )
}