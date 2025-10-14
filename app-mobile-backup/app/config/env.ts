/**
 * Environment configuration
 * In production, use react-native-config or similar for proper env management
 */

export const ENV = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8787',
  PAYMENTS_PROVIDER: process.env.PAYMENTS_PROVIDER || 'demo',
  MAX_RETAKES: parseInt(process.env.MAX_RETAKES || '2', 10),
  SCREEN_TIMEOUTS: {
    Attract: 30,
    Layout: 45,
    Capture: 60,
    Customize: 60,
    Product: 120,
    Checkout: 180,
  },
};

// Parse SCREEN_TIMEOUTS if provided as JSON string
try {
  if (process.env.SCREEN_TIMEOUTS) {
    ENV.SCREEN_TIMEOUTS = JSON.parse(process.env.SCREEN_TIMEOUTS);
  }
} catch (e) {
  console.warn('Failed to parse SCREEN_TIMEOUTS, using defaults');
}
