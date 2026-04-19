'use client'
import { useState, useEffect, Suspense } from 'react'
import { generateFacturePDF } from '@/lib/generatePDF'
import { createBrowserClient } from '@supabase/ssr'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function DashboardContent() {
  const [form, setForm] = useState({
    numero: 'F-001',
    date_emission: new Date().toISOString().split('T')[0],
    date_echeance: '',
    from_nom: '',
    from_adresse: '',
    from_siret: '',
    from_email: '',
    to_nom: '',
    to_adresse: '',
    description: '',
    qty: 1,
    prix_ht: 0,
    tva_pct: 20,
    notes: ''
  })

  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setForm(f => ({
          ...f,
          from_nom: profile.nom || '',
          from_adresse: profile.adresse || '',
          from_siret: profile.siret || '',
          from_email: user.email || '',
        }))
      }
    }
    load()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const ht = Number(form.qty) * Number(form.prix_ht)
  const tva = ht * Number(form.tva_pct) / 100
  const ttc = ht + tva

  const handleGenerate = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    generateFacturePDF({
      numero: form.numero,
      date_emission: form.date_emission,
      date_echeance: form.date_echeance,
      from: {
        nom: form.from_nom,
        adresse: form.from_adresse,
        siret: form.from_siret,
        email: form.from_email,
      },
      to: {
        nom: form.to_nom,
        adresse: form.to_adresse,
      },
      lignes: [{
        description: form.description,
        qty: Number(form.qty),
        prix_ht: Number(form.prix_ht),
      }],
      tva_pct: Number(form.tva_pct),
      notes: form.notes
    })

    // Sauvegarde en base
    await supabase.from('factures').insert({
      user_id: user.id,
      numero: form.numero,
      date_emission: form.date_emission,
      date_echeance: form.date_echeance,
      montant_ht: ht,
      tva_pct: Number(form.tva_pct),
      statut: 'pending',
      lignes: [{ description: form.description, qty: Number(form.qty), prix_ht: Number(form.prix_ht) }],
      notes: form.notes
    })
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
    fontSize: '0.75rem',
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

  const sectionTitle = (label: string, color = '#c8f55a') => (
    <div style={{
      fontSize: '0.72rem', fontWeight: '800',
      color, textTransform: 'uppercase' as const,
      letterSpacing: '0.08em', marginBottom: '1.2rem',
      display: 'flex', alignItems: 'center', gap: '0.5rem'
    }}>
      <div style={{ width: '3px', height: '14px', background: color, borderRadius: '2px' }}></div>
      {label}
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
          maxWidth: '1000px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '60px'
        }}>
          <Link href="/" style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '-0.02em', textDecoration: 'none', color: '#f5f5f5' }}>
            auto<span style={{ color: '#c8f55a' }}>facture</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/factures" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}>Factures</Link>
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

        {/* Message succès paiement */}
        {success === '1' && (
          <div style={{
            background: 'rgba(77,219,138,0.08)',
            border: '1px solid rgba(77,219,138,0.2)',
            borderRadius: '12px', padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '1rem'
          }}>
            <div style={{ fontSize: '1.5rem' }}>🎉</div>
            <div>
              <div style={{ fontWeight: '700', color: '#4ddb8a', marginBottom: '0.2rem' }}>
                Abonnement activé !
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                Bienvenue dans le Plan Pro. Tu as maintenant accès à toutes les fonctionnalités.
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.03em', margin: '0 0 0.3rem' }}>
            Nouvelle facture
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', margin: 0 }}>
            Remplis les informations ci-dessous et télécharge ton PDF en un clic.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>

          {/* Colonne gauche */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={cardStyle}>
              {sectionTitle('Informations facture')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Numéro', name: 'numero', type: 'text' },
                  { label: "Date d'émission", name: 'date_emission', type: 'date' },
                  { label: "Date d'échéance", name: 'date_echeance', type: 'date' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type={f.type} name={f.name} value={(form as any)[f.name]} onChange={handleChange} style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={cardStyle}>
                {sectionTitle('De — toi', '#5ab4f5')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {[
                    { label: 'Nom / Entreprise', name: 'from_nom' },
                    { label: 'Email', name: 'from_email' },
                    { label: 'Adresse', name: 'from_adresse' },
                    { label: 'SIRET', name: 'from_siret' },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={labelStyle}>{f.label}</label>
                      <input name={f.name} value={(form as any)[f.name]} onChange={handleChange} style={inputStyle} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={cardStyle}>
                {sectionTitle('À — ton client', '#f5a623')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {[
                    { label: 'Nom / Entreprise', name: 'to_nom' },
                    { label: 'Adresse', name: 'to_adresse' },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={labelStyle}>{f.label}</label>
                      <input name={f.name} value={(form as any)[f.name]} onChange={handleChange} style={inputStyle} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              {sectionTitle('Prestation', '#4ddb8a')}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Description', name: 'description', type: 'text' },
                  { label: 'Quantité', name: 'qty', type: 'number' },
                  { label: 'Prix HT (€)', name: 'prix_ht', type: 'number' },
                  { label: 'TVA (%)', name: 'tva_pct', type: 'number' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type={f.type} name={f.name} value={(form as any)[f.name]} onChange={handleChange} style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              {sectionTitle('Notes', 'rgba(255,255,255,0.2)')}
              <textarea
                name="notes" value={form.notes} onChange={handleChange}
                placeholder="Conditions de paiement, mentions légales..."
                style={{ ...inputStyle, height: '90px', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Colonne droite */}
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.8rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
                Récapitulatif
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Sous-total HT</span>
                  <span style={{ fontWeight: '600' }}>{ht.toFixed(2)} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>TVA {form.tva_pct}%</span>
                  <span style={{ fontWeight: '600' }}>{tva.toFixed(2)} €</span>
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.3rem 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700' }}>Total TTC</span>
                  <span style={{ fontWeight: '800', fontSize: '1.3rem', color: '#c8f55a' }}>{ttc.toFixed(2)} €</span>
                </div>
              </div>
              <button onClick={handleGenerate} style={{
                width: '100%', padding: '0.9rem',
                background: '#c8f55a', border: 'none',
                borderRadius: '9px', cursor: 'pointer',
                fontWeight: '800', fontSize: '0.95rem',
                color: '#0a0a0a', letterSpacing: '-0.01em',
                fontFamily: 'inherit'
              }}>
                ⬇ Télécharger le PDF
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.8rem', marginBottom: 0 }}>
                PDF conforme aux normes françaises
              </p>
            </div>

            <div style={{ background: 'rgba(200,245,90,0.04)', border: '1px solid rgba(200,245,90,0.1)', borderRadius: '12px', padding: '1.2rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(200,245,90,0.7)', fontWeight: '600', marginBottom: '0.4rem' }}>💡 Astuce</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
                Passe en <Link href="/pricing" style={{ color: '#c8f55a', textDecoration: 'none', fontWeight: '600' }}>Plan Pro</Link> pour des factures illimitées et des relances automatiques.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>Chargement...</div>}>
      <DashboardContent />
    </Suspense>
  )
}