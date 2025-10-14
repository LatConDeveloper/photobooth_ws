export type PaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  clientSecret?: string;
  checkoutUrl?: string;
};

export interface PaymentsProvider {
  createIntent(amount: number, currency: string, metadata?: Record<string, any>): Promise<PaymentIntent>;
  captureIntent(intentId: string): Promise<PaymentIntent>;
  refundIntent(intentId: string, amount?: number): Promise<void>;
  verifyWebhook(payload: any, signature: string): any;
}
