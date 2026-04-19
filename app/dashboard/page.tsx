'use client'
import { useState } from 'react'
import { generateFacturePDF } from '@/lib/generatePDF'

export default function Dashboard() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleGenerate = () => {
    generateFacturePDF({
      numero:        form.numero,
      date_emission: form.date_emission,
      date_echeance: form.date_echeance,
      from: {
        nom:     form.from_nom,
        adresse: form.from_adresse,
        siret:   form.from_siret,
        email:   form.from_email,
      },
      to: {
        nom:     form.to_nom,
        adresse: form.to_adresse,
      },
      lignes: [{
        description: form.description,
        qty:         Number(form.qty),
        prix_ht:     Number(form.prix_ht),
      }],
      tva_pct: Number(form.tva_pct),
      notes:   form.notes
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0c0c0a',
      color: '#f0ede6',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem'
    }}>

      {/* Header */}
      <div style={{
        maxWidth: '800px', margin: '0 auto 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: '1.5rem', borderBottom: '1px solid #272724'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
            Auto<span style={{ color: '#c8f55a' }}>Facture</span>
          </h1>
          <p style={{ color: '#7a7a72', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>
            Créer une nouvelle facture
          </p>
        </div>
        <div style={{
          background: 'rgba(200,245,90,0.1)',
          border: '1px solid rgba(200,245,90,0.2)',
          color: '#c8f55a', padding: '0.4rem 1rem',
          borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700'
        }}>
          ✦ Plan Gratuit
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Infos facture */}
        <div style={{ background: '#181816', border: '1px solid #272724', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.2rem', fontSize: '0.85rem', fontWeight: '800', color: '#c8f55a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            📄 Infos facture
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Numéro', name: 'numero', type: 'text' },
              { label: "Date d'émission", name: 'date_emission', type: 'date' },
              { label: "Date d'échéance", name: 'date_echeance', type: 'date' },
            ].map(f => (
              <div key={f.name}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#7a7a72', marginBottom: '0.4rem', fontWeight: '600' }}>{f.label}</label>
                <input
                  type={f.type} name={f.name}
                  value={(form as any)[f.name]} onChange={handleChange}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#0c0c0a', border: '1px solid #272724', borderRadius: '6px', color: '#f0ede6', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* De / À */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* De */}
          <div style={{ background: '#181816', border: '1px solid #272724', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.2rem', fontSize: '0.85rem', fontWeight: '800', color: '#5ab4f5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              👤 De (toi)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                { label: 'Nom / Entreprise', name: 'from_nom' },
                { label: 'Email', name: 'from_email' },
                { label: 'Adresse', name: 'from_adresse' },
                { label: 'SIRET', name: 'from_siret' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#7a7a72', marginBottom: '0.4rem', fontWeight: '600' }}>{f.label}</label>
                  <input
                    name={f.name} value={(form as any)[f.name]} onChange={handleChange}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#0c0c0a', border: '1px solid #272724', borderRadius: '6px', color: '#f0ede6', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* À */}
          <div style={{ background: '#181816', border: '1px solid #272724', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.2rem', fontSize: '0.85rem', fontWeight: '800', color: '#f5a623', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              🏢 À (ton client)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                { label: 'Nom / Entreprise', name: 'to_nom' },
                { label: 'Adresse', name: 'to_adresse' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#7a7a72', marginBottom: '0.4rem', fontWeight: '600' }}>{f.label}</label>
                  <input
                    name={f.name} value={(form as any)[f.name]} onChange={handleChange}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#0c0c0a', border: '1px solid #272724', borderRadius: '6px', color: '#f0ede6', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prestation */}
        <div style={{ background: '#181816', border: '1px solid #272724', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.2rem', fontSize: '0.85rem', fontWeight: '800', color: '#4ddb8a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            💼 Prestation
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Description', name: 'description', type: 'text' },
              { label: 'Quantité', name: 'qty', type: 'number' },
              { label: 'Prix HT (€)', name: 'prix_ht', type: 'number' },
              { label: 'TVA (%)', name: 'tva_pct', type: 'number' },
            ].map(f => (
              <div key={f.name}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#7a7a72', marginBottom: '0.4rem', fontWeight: '600' }}>{f.label}</label>
                <input
                  type={f.type} name={f.name}
                  value={(form as any)[f.name]} onChange={handleChange}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#0c0c0a', border: '1px solid #272724', borderRadius: '6px', color: '#f0ede6', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Total preview */}
        <div style={{ background: 'rgba(200,245,90,0.05)', border: '1px solid rgba(200,245,90,0.15)', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '3rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#7a7a72', marginBottom: '0.2rem' }}>Sous-total HT</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              {(Number(form.qty) * Number(form.prix_ht)).toFixed(2)} €
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#7a7a72', marginBottom: '0.2rem' }}>TVA {form.tva_pct}%</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              {(Number(form.qty) * Number(form.prix_ht) * Number(form.tva_pct) / 100).toFixed(2)} €
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#7a7a72', marginBottom: '0.2rem' }}>Total TTC</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#c8f55a' }}>
              {(Number(form.qty) * Number(form.prix_ht) * (1 + Number(form.tva_pct) / 100)).toFixed(2)} €
            </div>
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: '#181816', border: '1px solid #272724', borderRadius: '12px', padding: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#7a7a72', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            📝 Notes (optionnel)
          </label>
          <textarea
            name="notes" value={form.notes} onChange={handleChange}
            placeholder="Conditions de paiement, mentions légales..."
            style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#0c0c0a', border: '1px solid #272724', borderRadius: '6px', color: '#f0ede6', fontSize: '0.88rem', height: '80px', resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>

        {/* Bouton */}
        <button onClick={handleGenerate} style={{
          padding: '1rem 2rem', background: '#c8f55a',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          fontWeight: '800', fontSize: '1rem', color: '#0c0c0a',
          width: '100%', letterSpacing: '0.03em'
        }}>
          ⬇️ Générer et télécharger le PDF
        </button>

      </div>
    </div>
  )
}