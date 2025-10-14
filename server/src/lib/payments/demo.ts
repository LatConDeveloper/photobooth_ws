import type { PaymentsProvider, PaymentIntent } from './provider.js';

/**
 * Demo payment provider for testing.
 * Approves all payments with amount <= 0.01 or randomly approves others.
 */
export class DemoPaymentsProvider implements PaymentsProvider {
  private intents: Map<string, PaymentIntent> = new Map();

  async createIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    const id = `demo_pi_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    // Auto-approve if amount is $0.01 or less
    const shouldApprove = amount <= 1 || Math.random() > 0.1; // 90% approval rate
    
    const intent: PaymentIntent = {
      id,
      amount,
      currency,
      status: shouldApprove ? 'succeeded' : 'failed',
      clientSecret: `demo_secret_${id}`,
      checkoutUrl: `http://localhost:8787/demo-checkout/${id}`,
    };

    this.intents.set(id, intent);
    
    console.log(`[DemoPayments] Created intent ${id} for ${amount} ${currency} - ${intent.status}`);
    
    return intent;
  }

  async captureIntent(intentId: string): Promise<PaymentIntent> {
    const intent = this.intents.get(intentId);
    if (!intent) {
      throw new Error(`Intent ${intentId} not found`);
    }
    
    if (intent.status === 'pending') {
      intent.status = 'succeeded';
    }
    
    return intent;
  }

  async refundIntent(intentId: string, amount?: number): Promise<void> {
    const intent = this.intents.get(intentId);
    if (!intent) {
      throw new Error(`Intent ${intentId} not found`);
    }
    
    console.log(`[DemoPayments] Refunded ${amount || intent.amount} for intent ${intentId}`);
  }

  verifyWebhook(payload: any, signature: string): any {
    // Demo provider doesn't verify signatures
    return payload;
  }
}
