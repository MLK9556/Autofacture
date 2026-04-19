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
        qty:      Number(form.qty),
        prix_ht:  Number(form.prix_ht),
      }],
      tva_pct: Number(form.tva_pct),
      notes:   form.notes
    })
  }

  const input = {
    padding: '0.5rem',
    fontSize: '0.9rem',
    borderRadius: '6px',
    border: '1px solid #333',
    background: '#1a1a18',
    color: '#f0ede6',
    width: '100%'
  }

  const label = {
    fontSize: '0.8rem',
    color: '#7a7a72',
    marginBottom: '0.3rem',
    display: 'block'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif', color: '#f0ede6', background: '#0c0c0a', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '2rem', color: '#c8f55a' }}>📄 Créer une facture</h1>

      {/* Infos facture */}
      <h3 style={{ marginBottom: '1rem' }}>Infos facture</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={label}>Numéro</label>
          <input style={input} name="numero" value={form.numero} onChange={handleChange} />
        </div>
        <div>
          <label style={label}>Date d'émission</label>
          <input style={input} type="date" name="date_emission" value={form.date_emission} onChange={handleChange} />
        </div>
        <div>
          <label style={label}>Date d'échéance</label>
          <input style={input} type="date" name="date_echeance" value={form.date_echeance} onChange={handleChange} />
        </div>
      </div>

      {/* De */}
      <h3 style={{ marginBottom: '1rem' }}>De (toi)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={label}>Nom / Entreprise</label>
          <input style={input} name="from_nom" value={form.from_nom} onChange={handleChange} />
        </div>
        <div>
          <label style={label}>Email</label>
          <input style={input} name="from_email" value={form.from_email} onChange={handleChange} />
        </div>
        <div>
          <label style={label}>Adresse</label>
          <input style={input} name="from_adresse" value={form.from_adresse} onChange={handleChange} />
        </div>
        <div>
          <label style={label}>SIRET</label>
          <input style={input} name="from_siret" value={form.from_siret} onChange={handleChange} />
        </div>
      </div>

      {/* À */}
      <h3 style={{ marginBottom: '1rem' }}>À (ton client)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={label}>Nom / Entreprise</label>
          <input style={input} name="to_nom" value={form.to_nom} onChange={handleChange} />
        </div>
        <div>
          <label style={label}>Adresse</label>
          <input style={input} name="to_adresse" value={form.to_adresse} onChange={handleChange} />
        </div>
      </div>

      {/* Prestation */}
      <h3 style={{ marginBottom: '1rem' }}>Prestation</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={label}>Description</label>
          <input style={input} name="description" value={form.description} onChange={handleChange} />
        </div>
        <div>
          <label style={label}>Quantité</label>
          <input style={input} type="number" name="qty" value={form.qty} onChange={handleChange} />
        </div>
        <div>
          <label style={label}>Prix HT (€)</label>
          <input style={input} type="number" name="prix_ht" value={form.prix_ht} onChange={handleChange} />
        </div>
        <div>
          <label style={label}>TVA (%)</label>
          <input style={input} type="number" name="tva_pct" value={form.tva_pct} onChange={handleChange} />
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={label}>Notes (optionnel)</label>
        <textarea style={{ ...input, height: '80px', resize: 'vertical' }} name="notes" value={form.notes} onChange={handleChange} />
      </div>

      {/* Bouton */}
      <button
        onClick={handleGenerate}
        style={{ padding: '0.8rem 2rem', background: '#c8f55a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: '#0c0c0a' }}
      >
        ⬇️ Télécharger le PDF
      </button>
    </div>
  )
}