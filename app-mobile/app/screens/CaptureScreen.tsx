import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useIdleTimer } from '../hooks/useIdleTimer';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Capture'>;
};

export default function CaptureScreen({ navigation }: Props) {
  useIdleTimer('Capture', () => navigation.navigate('Attract'));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture Screen</Text>
      <Text style={styles.subtitle}>Camera integration coming in FE-E3</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Customize')}
      >
        <Text style={styles.buttonText}>Continue (Mock)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: '#a0a0a0',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 12,
    minWidth: 200,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  backButton: {
    backgroundColor: '#3a3a4e',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 150,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
