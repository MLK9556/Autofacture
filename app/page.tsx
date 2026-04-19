import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#f5f5f5',
      fontFamily: "'Inter', system-ui, sans-serif",
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
          <div style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            auto<span style={{ color: '#c8f55a' }}>facture</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/pricing" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: '500' }}>Tarifs</Link>
            <Link href="/auth" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: '500' }}>Connexion</Link>
            <Link href="/auth" style={{
              background: '#c8f55a', color: '#0a0a0a',
              padding: '0.5rem 1.2rem', borderRadius: '8px',
              fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none',
              letterSpacing: '-0.01em'
            }}>
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '7rem 2rem 5rem', textAlign: 'center' }}>
        
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(200,245,90,0.08)',
          border: '1px solid rgba(200,245,90,0.15)',
          color: '#c8f55a', padding: '0.35rem 1rem',
          borderRadius: '100px', fontSize: '0.75rem',
          fontWeight: '600', marginBottom: '2rem',
          letterSpacing: '0.02em'
        }}>
          <span style={{ width: '6px', height: '6px', background: '#c8f55a', borderRadius: '50%', display: 'inline-block' }}></span>
          Conçu pour les auto-entrepreneurs français
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: '900', lineHeight: 1.05,
          letterSpacing: '-0.04em', margin: '0 0 1.5rem',
          maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto'
        }}>
          La facturation qui<br />
          <span style={{
            background: 'linear-gradient(135deg, #c8f55a 0%, #8ef55a 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            travaille à ta place
          </span>
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.45)', fontSize: '1.1rem',
          lineHeight: 1.8, marginBottom: '3rem',
          maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto'
        }}>
          Crée des factures professionnelles en 30 secondes, télécharge-les en PDF et laisse AutoFacture relancer tes clients impayés.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <Link href="/auth" style={{
            background: '#c8f55a', color: '#0a0a0a',
            padding: '0.9rem 2rem', borderRadius: '10px',
            fontWeight: '800', fontSize: '0.95rem', textDecoration: 'none',
            letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            Créer mon compte gratuit <span>→</span>
          </Link>
          <Link href="/pricing" style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)',
            padding: '0.9rem 2rem', borderRadius: '10px',
            fontWeight: '600', fontSize: '0.95rem', textDecoration: 'none',
          }}>
            Voir les tarifs
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '3rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '3rem', flexWrap: 'wrap'
        }}>
          {[
            { value: '30s', label: 'pour créer une facture' },
            { value: '0€', label: 'pour commencer' },
            { value: '100%', label: 'conforme aux normes FR' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#c8f55a', letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 2rem 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.03em', margin: '0 0 0.8rem' }}>
            Tout ce dont tu as besoin
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.95rem' }}>
            Pas de superflu. Juste ce qui compte pour facturer vite et bien.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          {[
            {
              icon: '⚡',
              title: 'PDF instantané',
              desc: 'Factures aux normes françaises générées en un clic. SIRET, TVA, mentions légales — tout est inclus automatiquement.',
              color: '#c8f55a'
            },
            {
              icon: '🔔',
              title: 'Relances automatiques',
              desc: 'AutoFacture envoie des relances graduelles à tes clients en retard. J+1, J+15, J+30 — sans que tu n\'aies à y penser.',
              color: '#5ab4f5'
            },
            {
              icon: '📊',
              title: 'Suivi en temps réel',
              desc: 'Visualise ton chiffre d\'affaires, ta TVA collectée et tes impayés en un coup d\'œil depuis ton dashboard.',
              color: '#f5a623'
            },
            {
              icon: '🔒',
              title: 'Connexion sans mot de passe',
              desc: 'Accès sécurisé par Magic Link. Un email, un clic, tu es connecté. Aucun mot de passe à retenir.',
              color: '#c8f55a'
            },
            {
              icon: '💼',
              title: 'Gestion des clients',
              desc: 'Sauvegarde tes clients et réutilise leurs informations en un clic. Fini de re-saisir les mêmes données.',
              color: '#5ab4f5'
            },
            {
              icon: '💳',
              title: 'Abonnement flexible',
              desc: 'Commence gratuitement avec 5 factures/mois. Passe Pro à 9€/mois quand ton activité décolle.',
              color: '#f5a623'
            },
          ].map(f => (
            <div key={f.title} style={{
              background: '#111111',
              padding: '2rem',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: `${f.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', marginBottom: '1rem'
              }}>
                {f.icon}
              </div>
              <div style={{ fontWeight: '700', marginBottom: '0.6rem', fontSize: '0.95rem' }}>{f.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '6rem 2rem', textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em', margin: '0 0 1rem' }}>
          Prêt à gagner du temps ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Gratuit pour commencer · Sans carte bancaire · Annulable à tout moment
        </p>
        <Link href="/auth" style={{
          background: '#c8f55a', color: '#0a0a0a',
          padding: '1rem 2.5rem', borderRadius: '10px',
          fontWeight: '800', fontSize: '1rem', textDecoration: 'none',
          letterSpacing: '-0.01em'
        }}>
          Commencer gratuitement →
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem', textAlign: 'center',
        color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem'
      }}>
        © 2025 AutoFacture · Fait pour les freelances français
      </div>

    </div>
  )
}