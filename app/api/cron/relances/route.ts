import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET() {
  const today = new Date()

  const { data: factures } = await supabase
    .from('factures')
    .select('*, clients(*), profiles(*)')
    .eq('statut', 'pending')
    .lt('date_echeance', today.toISOString())

  for (const f of factures ?? []) {
    const retard = Math.floor(
      (today.getTime() - new Date(f.date_echeance).getTime()) / 86400000
    )

    let sujet = '', message = ''

    if (retard >= 30) {
      sujet   = `⚠️ 3ème relance — Facture ${f.numero} (${retard}j de retard)`
      message = `Ceci est notre troisième et dernière relance. Sans réponse sous 5 jours, un recouvrement sera engagé.`
    } else if (retard >= 15) {
      sujet   = `Relance — Facture ${f.numero} en attente`
      message = `Nous vous rappelons que la facture ${f.numero} d'un montant de ${(f.montant_ht * 1.2).toFixed(2)}€ est impayée.`
    } else if (retard >= 1) {
      sujet   = `Rappel — Facture ${f.numero}`
      message = `Votre facture ${f.numero} est arrivée à échéance. Pouvez-vous procéder au règlement ?`
    } else continue

    await resend.emails.send({
      from: `AutoFacture <onboarding@resend.dev>`,
      to:   f.clients.email,
      subject: sujet,
      html: `<p>Bonjour ${f.clients.nom},</p>
             <p>${message}</p>
             <p>Cordialement,<br/>${f.profiles.nom}</p>`
    })
  }

  return new Response('Relances envoyées')
}