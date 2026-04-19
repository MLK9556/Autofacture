import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface Facture {
  numero:        string
  date_emission: string
  date_echeance: string
  from: { nom: string; adresse: string; siret: string; email: string }
  to:   { nom: string; adresse: string }
  lignes: Array<{ description: string; qty: number; prix_ht: number }>
  tva_pct: number
  notes?: string
}

export function generateFacturePDF(f: Facture): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, MARGIN = 18

  // Fond de page
  doc.setFillColor(250, 250, 248)
  doc.rect(0, 0, W, 297, 'F')

  // Bande sombre en haut
  doc.setFillColor(18, 18, 16)
  doc.rect(0, 0, W, 42, 'F')

  // Nom de l'entreprise
  doc.setTextColor(200, 245, 90)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(f.from.nom, MARGIN, 20)

  // Numéro de facture
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`FACTURE N° ${f.numero}`, W - MARGIN, 16, { align: 'right' })
  doc.text(`Émise le ${f.date_emission}`, W - MARGIN, 22, { align: 'right' })
  doc.text(`Échéance ${f.date_echeance}`, W - MARGIN, 28, { align: 'right' })

  // Adresses
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.text('DE', MARGIN, 55)
  doc.setFont('helvetica', 'normal')
  doc.text([f.from.nom, f.from.adresse, `SIRET : ${f.from.siret}`, f.from.email], MARGIN, 61)

  doc.setFont('helvetica', 'bold')
  doc.text('À', W / 2 + 10, 55)
  doc.setFont('helvetica', 'normal')
  doc.text([f.to.nom, f.to.adresse], W / 2 + 10, 61)

  // Tableau des prestations
  const rows = f.lignes.map(l => [
    l.description,
    l.qty.toString(),
    `${l.prix_ht.toFixed(2)} €`,
    `${(l.qty * l.prix_ht).toFixed(2)} €`
  ])

  autoTable(doc, {
    startY: 88,
    head: [['Description', 'Qté', 'PU HT', 'Total HT']],
    body: rows,
    theme: 'plain',
    headStyles: { fillColor: [24, 24, 22], textColor: [200, 245, 90], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
    alternateRowStyles: { fillColor: [245, 245, 243] },
    margin: { left: MARGIN, right: MARGIN },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' }
    }
  })

  // Totaux
  const ht     = f.lignes.reduce((s, l) => s + l.qty * l.prix_ht, 0)
  const tvaAmt = ht * f.tva_pct / 100
  const ttc    = ht + tvaAmt
  const finalY = (doc as any).lastAutoTable.finalY + 10

  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`Sous-total HT : ${ht.toFixed(2)} €`, W - MARGIN, finalY, { align: 'right' })
  doc.text(`TVA ${f.tva_pct}% : ${tvaAmt.toFixed(2)} €`, W - MARGIN, finalY + 6, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(18, 18, 16)
  doc.text(`TOTAL TTC : ${ttc.toFixed(2)} €`, W - MARGIN, finalY + 14, { align: 'right' })

  // Notes
  if (f.notes) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.setTextColor(140, 140, 140)
    doc.text(f.notes, MARGIN, finalY + 30)
  }

  // Footer légal
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(180, 180, 180)
  doc.text(
    'En cas de retard de paiement, des pénalités de retard au taux légal seront applicables.',
    W / 2, 282, { align: 'center' }
  )

  // Téléchargement
  doc.save(`facture-${f.numero}.pdf`)
}