import Stripe from 'stripe';

/** Jeden klient Stripe współdzielony przez tworzenie sesji płatności i obsługę webhooka. */
export const stripe = new Stripe(process.env.STRIPE_SK as string);
