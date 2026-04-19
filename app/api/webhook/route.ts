import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Signature invalide', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const userId  = session.metadata.user_id
    const plan    = session.metadata.plan

    await supabase.from('profiles').upsert({
      id: userId,
      plan,
      stripe_customer_id: session.customer,
      subscription_id:    session.subscription,
      plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })
  }

  return new Response('ok')
}