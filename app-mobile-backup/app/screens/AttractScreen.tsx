import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useStore } from '../store/useStore';
import { api } from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Attract'>;
};

export default function AttractScreen({ navigation }: Props) {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState<NodeJS.Timeout | null>(null);
  const { setSessionId, resetSession } = useStore();

  useEffect(() => {
    // Reset session when returning to attract
    resetSession();

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      pulse.stop();
      if (tapTimer) clearTimeout(tapTimer);
    };
  }, []);

  const handleStart = async () => {
    try {
      // Create session
      const { session_id } = await api.createSession();
      setSessionId(session_id);

      // Log event
      await api.logEvent('engagement', 'tap_to_start', { session_id });

      // Navigate to layout selection
      navigation.navigate('Layout');
    } catch (error) {
      console.error('Failed to start session:', error);
      // TODO: Show error UI
    }
  };

  // Hidden gesture for settings (5 taps in top-left corner)
  const handleCornerTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (tapTimer) clearTimeout(tapTimer);

    if (newCount >= 5) {
      // Open settings
      setTapCount(0);
      navigation.navigate('Settings');
    } else {
      // Reset counter after 2 seconds
      const timer = setTimeout(() => setTapCount(0), 2000);
      setTapTimer(timer);
    }
  };

  return (
    <View style={styles.container}>
      {/* Hidden settings trigger */}
      <Pressable
        style={styles.hiddenTrigger}
        onPress={handleCornerTap}
      />

      <View style={styles.content}>
        <Text style={styles.title}>PhotoBooth</Text>
        <Text style={styles.subtitle}>Create Amazing Memories</Text>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>TAP TO START</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.instructions}>
          Touch anywhere to begin your photo session
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  hiddenTrigger: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    color: '#a0a0a0',
    marginBottom: 60,
  },
  startButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 60,
    paddingVertical: 24,
    borderRadius: 16,
    minWidth: 300,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  instructions: {
    fontSize: 18,
    color: '#808080',
    marginTop: 40,
    textAlign: 'center',
  },
});
