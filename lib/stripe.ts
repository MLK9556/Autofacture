import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const PLANS = {
  pro: {
    name: 'Pro',
    price: 9,
    priceId: 'price_1TNzzp2H8taWJLST5Rmz0gFR',
    features: ['Factures illimitées', 'Relances auto', 'Export comptable']
  },
  business: {
    name: 'Business',
    price: 19,
    priceId: 'price_1TO00W2H8taWJLSTH3tXDEuq',
    features: ['Tout Pro', 'Multi-users', 'API access']
  }
}