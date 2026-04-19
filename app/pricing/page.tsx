'use client'
import { useState } from 'react'

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (plan: string) => {
    setLoading(plan)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    })
    const { url, error } = await res.json()
    if (error) {
      alert('Tu dois être connecté pour souscrire !')
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
      color: '#7a7a72',
      features: [
        '5 factures / mois',
        'Téléchargement PDF',
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
        'Support dédié',
      ],
      cta: 'Passer Business',
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0c0c0a',
      color: '#f0ede6',
      fontFamily: 'system-ui, sans-serif',
      padding: '4rem 2rem'
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(200,245,90,0.1)',
          border: '1px solid rgba(200,245,90,0.2)',
          color: '#c8f55a', padding: '0.4rem 1rem',
          borderRadius: '100px', fontSize: '0.75rem',
          fontWeight: '700', marginBottom: '1rem'
        }}>
          💰 Tarifs simples
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1rem' }}>
          Choisissez votre plan
        </h1>
        <p style={{ color: '#7a7a72', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
          Commencez gratuitement. Passez Pro quand vous êtes prêt. Annulez à tout moment.
        </p>
      </div>

      {/* Plans */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {plans.map(plan => (
          <div key={plan.id} style={{
            background: plan.popular ? 'rgba(200,245,90,0.05)' : '#181816',
            border: `1px solid ${plan.popular ? 'rgba(200,245,90,0.3)' : '#272724'}`,
            borderRadius: '16px',
            padding: '2rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>

            {/* Badge populaire */}
            {plan.popular && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%',
                transform: 'translateX(-50%)',
                background: '#c8f55a', color: '#0c0c0a',
                padding: '0.2rem 1rem', borderRadius: '100px',
                fontSize: '0.72rem', fontWeight: '800',
                whiteSpace: 'nowrap'
              }}>
                ✦ LE PLUS POPULAIRE
              </div>
            )}

            {/* Nom */}
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: plan.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              {plan.name}
            </div>

            {/* Prix */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f0ede6' }}>
                {plan.price}€
              </span>
              {plan.price > 0 && (
                <span style={{ color: '#7a7a72', fontSize: '0.85rem' }}> / mois</span>
              )}
            </div>

            {/* Features */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '2rem' }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                  <span style={{ color: plan.color }}>✓</span>
                  <span style={{ color: '#c0bdb6' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Bouton */}
            <button
              onClick={() => plan.href ? window.location.href = plan.href : handleUpgrade(plan.id)}
              disabled={loading === plan.id}
              style={{
                padding: '0.8rem',
                background: plan.popular ? '#c8f55a' : 'transparent',
                border: `1px solid ${plan.popular ? '#c8f55a' : '#272724'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.9rem',
                color: plan.popular ? '#0c0c0a' : '#f0ede6',
                width: '100%',
                opacity: loading === plan.id ? 0.7 : 1
              }}
            >
              {loading === plan.id ? 'Chargement...' : plan.cta}
            </button>

          </div>
        ))}
      </div>

      {/* Lien dashboard */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href="/dashboard" style={{ color: '#7a7a72', fontSize: '0.85rem', textDecoration: 'none' }}>
          → Aller au dashboard
        </a>
      </div>

    </div>
  )
}