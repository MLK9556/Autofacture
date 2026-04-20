import { stripe, PLANS } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { plan } = await req.json()
    console.log('Plan reçu:', plan)

    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    console.log('Token présent:', !!token)

    if (!token) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log('User ID:', user?.id, 'Auth error:', authError?.message)

    if (authError || !user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    console.log('Price ID utilisé:', PLANS[plan as keyof typeof PLANS]?.priceId)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PLANS[plan as keyof typeof PLANS].priceId, quantity: 1 }],
      customer_email: user.email,
      metadata: { user_id: user.id, plan },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })

    return NextResponse.json({ url: session.url })

  } catch (err: any) {
    console.error('Erreur checkout:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}