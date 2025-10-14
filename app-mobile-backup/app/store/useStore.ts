import { create } from 'zustand';
import { AppState, Photo, Layout, Template, OrderItem, CameraMode } from './types';

// Generate a simple device ID
const generateDeviceId = () => {
  return `device_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

/**
 * Global app state using Zustand
 */
export const useStore = create<AppState>((set, get) => ({
  // Initial state
  sessionId: null,
  deviceId: generateDeviceId(),
  selectedLayout: null,
  selectedTemplate: null,
  selectedFilters: [],
  photos: [],
  cameraMode: 'front',
  orderItems: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  deliveryEmail: '',
  deliveryPhone: '',

  // Actions
  setSessionId: (sessionId: string) => set({ sessionId }),

  setSelectedLayout: (layout: Layout) => set({ selectedLayout: layout }),

  setSelectedTemplate: (template: Template | null) => set({ selectedTemplate: template }),

  toggleFilter: (filterId: string) => {
    const { selectedFilters } = get();
    const index = selectedFilters.indexOf(filterId);
    if (index >= 0) {
      set({ selectedFilters: selectedFilters.filter((id) => id !== filterId) });
    } else {
      set({ selectedFilters: [...selectedFilters, filterId] });
    }
  },

  addPhoto: (photo: Photo) => {
    const { photos } = get();
    set({ photos: [...photos, photo] });
  },

  removeLastPhoto: () => {
    const { photos } = get();
    if (photos.length > 0) {
      set({ photos: photos.slice(0, -1) });
    }
  },

  clearPhotos: () => set({ photos: [] }),

  setCameraMode: (mode: CameraMode) => set({ cameraMode: mode }),

  setOrderItems: (items: OrderItem[]) => {
    set({ orderItems: items });
    get().calculateTotals();
  },

  calculateTotals: () => {
    const { orderItems } = get();
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.08); // 8% tax
    const total = subtotal + tax;
    set({ subtotal, tax, total });
  },

  setDeliveryEmail: (email: string) => set({ deliveryEmail: email }),

  setDeliveryPhone: (phone: string) => set({ deliveryPhone: phone }),

  resetSession: () => {
    const deviceId = get().deviceId;
    set({
      sessionId: null,
      selectedLayout: null,
      selectedTemplate: null,
      selectedFilters: [],
      photos: [],
      cameraMode: 'front',
      orderItems: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      deliveryEmail: '',
      deliveryPhone: '',
      deviceId, // Keep device ID
    });
  },
}));
