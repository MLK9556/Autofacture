import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const PLANS = {
  pro: {
    name: 'Pro',
    price: 9,
    priceId: 'prod_UMjS0b9a4toYuC',
    features: ['Factures illimitées', 'Relances auto', 'Export comptable']
  },
  business: {
    name: 'Business',
    price: 19,
    priceId: 'prod_UMjTA2gwfSECao',
    features: ['Tout Pro', 'Multi-users', 'API access']
  }
}