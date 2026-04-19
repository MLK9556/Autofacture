'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleUpgrade = async (plan: string) => {
    setLoading(plan)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/auth'
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    })
    const { url, error } = await res.json()
    if (error) {
      alert('Erreur lors du paiement, réessaie.')
      setLoading(null)
      return
    }
    window.location.href = url
  }

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      color: 'rgba(255,255,255,0.4)',
      features: [
        '5 factures / mois',
        'Téléchargement PDF',
        'Conforme normes françaises',
        'Support email',
      ],
      cta: 'Commencer gratuitement',
      href: '/auth'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9,
      color: '#c8f55a',
      popular: true,
      features: [
        'Factures illimitées',
        'Relances automatiques',
        'Export comptable',
        'Gestion des clients',
        'Support prioritaire',
      ],
      cta: 'Passer Pro',
    },
    {
      id: 'business',
      name: 'Business',
      price: 19,
      color: '#5ab4f5',
      features: [
        'Tout Pro inclus',
        'Multi-utilisateurs',
        'API access',
        'Support dédié 7j/7',
        'Onboarding personnalisé',
      ],
      cta: 'Passer Business',
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#f5f5f5',
      fontFamily: 'system-ui, sans-serif',
    }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(20px)',
        background: 'rgba(10,10,10,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 2rem',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '64px'
        }}>
          <Link href="/" style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em', textDecoration: 'none', color: '#f5f5f5' }}>
            auto<span style={{ color: '#c8f55a' }}>facture</span>
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/auth" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.88rem' }}>Connexion</Link>
            <Link href="/dashboard" style={{
              background: '#c8f55a', color: '#0a0a0a',
              padding: '0.5rem 1.2rem', borderRadius: '8px',
              fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none'
            }}>
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem 3rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(200,245,90,0.08)',
          border: '1px solid rgba(200,245,90,0.15)',
          color: '#c8f55a', padding: '0.35rem 1rem',
          borderRadius: '100px', fontSize: '0.75rem',
          fontWeight: '600', marginBottom: '1.5rem',
        }}>
          💰 Tarifs simples et transparents
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-0.04em', margin: '0 0 1rem', lineHeight: 1.1 }}>
          Choisissez votre plan
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
          Commencez gratuitement. Passez Pro quand vous êtes prêt.<br />Annulez à tout moment, sans engagement.
        </p>
      </div>

      {/* Plans */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        maxWidth: '950px',
        margin: '0 auto',
        padding: '0 2rem 6rem'
      }}>
        {plans.map(plan => (
          <div key={plan.id} style={{
            background: plan.popular ? 'rgba(200,245,90,0.04)' : '#111111',
            border: `1px solid ${plan.popular ? 'rgba(200,245,90,0.2)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: '16px',
            padding: '2rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {plan.popular && (
              <div style={{
                position: 'absolute', top: '-13px', left: '50%',
                transform: 'translateX(-50%)',
                background: '#c8f55a', color: '#0a0a0a',
                padding: '0.25rem 1rem', borderRadius: '100px',
                fontSize: '0.7rem', fontWeight: '800',
                whiteSpace: 'nowrap', letterSpacing: '0.05em'
              }}>
                ✦ LE PLUS POPULAIRE
              </div>
            )}

            <div style={{ marginBottom: '1.8rem' }}>
              <div style={{
                fontSize: '0.72rem', fontWeight: '800',
                color: plan.color, textTransform: 'uppercase',
                letterSpacing: '0.08em', marginBottom: '1rem'
              }}>
                {plan.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                <span style={{ fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-0.04em' }}>
                  {plan.price}€
                </span>
                {plan.price > 0 && (
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>/mois</span>
                )}
              </div>
              {plan.price === 0 && (
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.2rem' }}>
                  Pour toujours gratuit
                </div>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.87rem' }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: `${plan.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ color: plan.color, fontSize: '0.65rem', fontWeight: '800' }}>✓</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => plan.href ? window.location.href = plan.href : handleUpgrade(plan.id)}
              disabled={loading === plan.id}
              style={{
                padding: '0.85rem',
                background: plan.popular ? '#c8f55a' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${plan.popular ? '#c8f55a' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '9px', cursor: 'pointer',
                fontWeight: '700', fontSize: '0.88rem',
                color: plan.popular ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                width: '100%', fontFamily: 'inherit',
                opacity: loading === plan.id ? 0.7 : 1,
              }}
            >
              {loading === plan.id ? 'Chargement...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '4rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '2rem', textAlign: 'center' }}>
          Questions fréquentes
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { q: 'Puis-je annuler à tout moment ?', r: "Oui, sans engagement. Tu gardes accès jusqu'à la fin de ta période." },
            { q: 'Mes factures sont-elles conformes ?', r: 'Oui, toutes les mentions légales françaises obligatoires sont incluses.' },
            { q: 'Comment fonctionne le plan gratuit ?', r: "Tu peux créer jusqu'à 5 factures par mois sans carte bancaire." },
          ].map(item => (
            <div key={item.q} style={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', padding: '1.3rem 1.5rem'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.92rem' }}>{item.q}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.r}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
        © 2025 AutoFacture · Fait pour les freelances français
      </div>

    </div>
  )
}