import type { PaymentsProvider } from './provider.js';
import { DemoPaymentsProvider } from './demo.js';
import { StripePaymentsProvider } from './stripe.js';
import { SquarePaymentsProvider } from './square.js';

export type { PaymentsProvider, PaymentIntent } from './provider.js';

/**
 * Get the configured payment provider based on environment variables.
 */
export function getPaymentsProvider(): PaymentsProvider {
  const provider = process.env.PAYMENTS_PROVIDER || 'demo';

  switch (provider.toLowerCase()) {
    case 'stripe':
      if (!process.env.STRIPE_SECRET) {
        throw new Error('STRIPE_SECRET is required for Stripe provider');
      }
      return new StripePaymentsProvider(process.env.STRIPE_SECRET);

    case 'square':
      if (!process.env.SQUARE_ACCESS_TOKEN) {
        throw new Error('SQUARE_ACCESS_TOKEN is required for Square provider');
      }
      return new SquarePaymentsProvider(process.env.SQUARE_ACCESS_TOKEN);

    case 'demo':
    default:
      console.log('[Payments] Using demo provider');
      return new DemoPaymentsProvider();
  }
}
