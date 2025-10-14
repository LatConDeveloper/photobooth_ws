/**
 * Navigation types for React Navigation
 */

export type RootStackParamList = {
  Attract: undefined;
  Layout: undefined;
  Capture: undefined;
  Customize: undefined;
  Product: undefined;
  Checkout: undefined;
  Settings: undefined;
};

export type ScreenName = keyof RootStackParamList;
