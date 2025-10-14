/**
 * Type definitions for the app state
 */

export type CameraMode = 'front' | 'rear' | 'dslr';

export interface Layout {
  id: string;
  name: string;
  description: string;
  shots: number;
  price: number; // in cents
  enabled: boolean;
  thumbnail_url?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'frame' | 'overlay' | 'filter';
  overlay_url?: string;
  thumbnail_url?: string;
  enabled: boolean;
}

export interface Photo {
  id: string;
  uri: string;
  shotNumber: number;
  timestamp: Date;
}

export interface OrderItem {
  type: 'digital' | 'print';
  quantity: number;
  unitPrice: number;
}

export interface AppState {
  // Session
  sessionId: string | null;
  deviceId: string;

  // Flow state
  selectedLayout: Layout | null;
  selectedTemplate: Template | null;
  selectedFilters: string[];
  photos: Photo[];
  cameraMode: CameraMode;

  // Order
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;

  // Delivery
  deliveryEmail: string;
  deliveryPhone: string;

  // Actions
  setSessionId: (sessionId: string) => void;
  setSelectedLayout: (layout: Layout) => void;
  setSelectedTemplate: (template: Template | null) => void;
  toggleFilter: (filterId: string) => void;
  addPhoto: (photo: Photo) => void;
  removeLastPhoto: () => void;
  clearPhotos: () => void;
  setCameraMode: (mode: CameraMode) => void;
  setOrderItems: (items: OrderItem[]) => void;
  calculateTotals: () => void;
  setDeliveryEmail: (email: string) => void;
  setDeliveryPhone: (phone: string) => void;
  resetSession: () => void;
}
