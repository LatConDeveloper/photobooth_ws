import type { PaymentsProvider, PaymentIntent } from './provider.js';

/**
 * Square payment provider (stub).
 * Implement with actual Square SDK when needed.
 */
export class SquarePaymentsProvider implements PaymentsProvider {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async createIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    // TODO: Implement with Square SDK
    throw new Error('Square provider not yet implemented');
  }

  async captureIntent(intentId: string): Promise<PaymentIntent> {
    throw new Error('Square provider not yet implemented');
  }

  async refundIntent(intentId: string, amount?: number): Promise<void> {
    throw new Error('Square provider not yet implemented');
  }

  verifyWebhook(payload: any, signature: string): any {
    throw new Error('Square provider not yet implemented');
  }
}
