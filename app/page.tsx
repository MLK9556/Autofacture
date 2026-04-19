import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0c0c0a',
      color: '#f0ede6',
      fontFamily: 'system-ui, sans-serif',
    }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.2rem 2rem', borderBottom: '1px solid #272724',
        maxWidth: '1100px', margin: '0 auto'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>
          Auto<span style={{ color: '#c8f55a' }}>Facture</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/pricing" style={{ color: '#7a7a72', textDecoration: 'none', fontSize: '0.9rem' }}>Tarifs</Link>
          <Link href="/auth" style={{
            background: '#c8f55a', color: '#0c0c0a',
            padding: '0.5rem 1.2rem', borderRadius: '8px',
            fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none'
          }}>
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem 3rem', maxWidth: '750px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(200,245,90,0.1)',
          border: '1px solid rgba(200,245,90,0.2)',
          color: '#c8f55a', padding: '0.4rem 1rem',
          borderRadius: '100px', fontSize: '0.75rem',
          fontWeight: '700', marginBottom: '1.5rem'
        }}>
          ✦ Pour auto-entrepreneurs & freelances français
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: 1.1, margin: '0 0 1.5rem' }}>
          Facturez en<br />
          <span style={{ color: '#c8f55a' }}>30 secondes</span>
        </h1>

        <p style={{ color: '#7a7a72', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Créez des factures professionnelles aux normes françaises,<br />
          téléchargez-les en PDF et envoyez des relances automatiques.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth" style={{
            background: '#c8f55a', color: '#0c0c0a',
            padding: '0.9rem 2rem', borderRadius: '10px',
            fontWeight: '800', fontSize: '1rem', textDecoration: 'none'
          }}>
            Commencer gratuitement →
          </Link>
          <Link href="/pricing" style={{
            background: 'transparent', color: '#f0ede6',
            padding: '0.9rem 2rem', borderRadius: '10px',
            fontWeight: '700', fontSize: '1rem', textDecoration: 'none',
            border: '1px solid #272724'
          }}>
            Voir les tarifs
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { icon: '📄', title: 'PDF en 1 clic', desc: 'Factures aux normes françaises, prêtes à envoyer.' },
          { icon: '🔔', title: 'Relances auto', desc: 'Oublie les impayés — on relance tes clients à ta place.' },
          { icon: '💸', title: 'Zéro comptable', desc: 'Suivi TVA, CA et échéances en temps réel.' },
        ].map(f => (
          <div key={f.title} style={{
            background: '#181816', border: '1px solid #272724',
            borderRadius: '12px', padding: '1.5rem'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>{f.icon}</div>
            <div style={{ fontWeight: '700', marginBottom: '0.4rem' }}>{f.title}</div>
            <div style={{ color: '#7a7a72', fontSize: '0.88rem', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* CTA final */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ color: '#7a7a72', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Gratuit pour commencer · Sans carte bancaire
        </p>
        <Link href="/auth" style={{
          background: '#c8f55a', color: '#0c0c0a',
          padding: '1rem 2.5rem', borderRadius: '10px',
          fontWeight: '800', fontSize: '1rem', textDecoration: 'none'
        }}>
          Créer mon compte gratuit
        </Link>
      </div>

    </div>
  )
}