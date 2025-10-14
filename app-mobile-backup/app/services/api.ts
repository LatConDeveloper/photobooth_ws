import axios, { AxiosInstance } from 'axios';
import { ENV } from '../config/env';

/**
 * API client for PhotoBooth backend
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ENV.API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[API] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck() {
    const { data } = await this.client.get('/health');
    return data;
  }

  // Sessions
  async createSession(deviceId?: string) {
    const { data } = await this.client.post('/sessions', {
      device_id: deviceId,
      metadata: {},
    });
    return data;
  }

  async getSession(sessionId: string) {
    const { data } = await this.client.get(`/sessions/${sessionId}`);
    return data;
  }

  // Catalogs
  async getLayouts() {
    const { data } = await this.client.get('/catalogs/layouts');
    return data;
  }

  async getTemplates() {
    const { data } = await this.client.get('/catalogs/templates');
    return data;
  }

  // Photos (to be implemented in BE-2)
  async uploadPhoto(sessionId: string, photoData: FormData) {
    const { data } = await this.client.post('/captures', photoData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Session-ID': sessionId,
      },
    });
    return data;
  }

  // Orders (to be implemented in BE-2)
  async createOrder(sessionId: string, items: any[]) {
    const { data } = await this.client.post('/orders', {
      session_id: sessionId,
      items,
    });
    return data;
  }

  // Payments (to be implemented in BE-2)
  async createPaymentIntent(orderId: string, amount: number) {
    const { data } = await this.client.post('/payments/intent', {
      order_id: orderId,
      amount,
      currency: 'USD',
    });
    return data;
  }

  // Deliveries (to be implemented in BE-2)
  async createDelivery(orderId: string, type: string, recipient: string) {
    const { data } = await this.client.post(`/deliveries/${type}`, {
      order_id: orderId,
      recipient,
    });
    return data;
  }

  // Events/Telemetry (to be implemented in BE-3)
  async logEvent(eventType: string, eventName: string, properties: any = {}) {
    try {
      await this.client.post('/events', {
        event_type: eventType,
        event_name: eventName,
        properties,
      });
    } catch (error) {
      // Don't throw on telemetry errors
      console.warn('[API] Failed to log event:', error);
    }
  }
}

export const api = new ApiClient();
