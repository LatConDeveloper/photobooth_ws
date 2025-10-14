import { useEffect, useRef } from 'react';
import { AppState as RNAppState } from 'react-native';
import { ENV } from '../config/env';
import { ScreenName } from '../navigation/types';

/**
 * Hook to handle idle timeout and return to attract screen
 */
export function useIdleTimer(
  screenName: ScreenName,
  onTimeout: () => void,
  enabled: boolean = true
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef(RNAppState.currentState);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!enabled || screenName === 'Attract') {
      return;
    }

    const timeout = ENV.SCREEN_TIMEOUTS[screenName] || 60;
    timeoutRef.current = setTimeout(() => {
      console.log(`[IdleTimer] Timeout on ${screenName} after ${timeout}s`);
      onTimeout();
    }, timeout * 1000);
  };

  useEffect(() => {
    resetTimer();

    // Listen for app state changes (background/foreground)
    const subscription = RNAppState.addEventListener('change', (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground, reset timer
        resetTimer();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      subscription.remove();
    };
  }, [screenName, enabled]);

  return { resetTimer };
}
