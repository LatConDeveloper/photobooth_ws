import type { PaymentsProvider, PaymentIntent } from './provider.js';

/**
 * Stripe payment provider (stub).
 * Implement with actual Stripe SDK when needed.
 */
export class StripePaymentsProvider implements PaymentsProvider {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async createIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    // TODO: Implement with Stripe SDK
    throw new Error('Stripe provider not yet implemented');
  }

  async captureIntent(intentId: string): Promise<PaymentIntent> {
    throw new Error('Stripe provider not yet implemented');
  }

  async refundIntent(intentId: string, amount?: number): Promise<void> {
    throw new Error('Stripe provider not yet implemented');
  }

  verifyWebhook(payload: any, signature: string): any {
    throw new Error('Stripe provider not yet implemented');
  }
}
