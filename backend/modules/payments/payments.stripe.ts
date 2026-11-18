import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config({ path: './.env.local' });

/** Jeden klient Stripe współdzielony przez tworzenie sesji płatności i obsługę webhooka. */
export const stripe = new Stripe(process.env.STRIPE_SK);
