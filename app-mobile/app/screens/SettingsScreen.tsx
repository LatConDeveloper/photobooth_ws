import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const ADMIN_PIN = '1234'; // TODO: Move to secure storage

export default function SettingsScreen({ navigation }: Props) {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = () => {
    if (pin === ADMIN_PIN) {
      Alert.alert('Success', 'Settings access granted');
      setPin('');
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsLocked(true);
        Alert.alert('Locked', 'Too many failed attempts. Try again in 60 seconds.');
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
        }, 60000);
      } else {
        Alert.alert('Error', `Incorrect PIN. ${3 - newAttempts} attempts remaining.`);
      }
      setPin('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Settings</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Enter PIN</Text>
        <TextInput
          style={styles.input}
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          editable={!isLocked}
          placeholder="****"
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={[styles.button, isLocked && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLocked || pin.length !== 4}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        {isLocked && (
          <Text style={styles.lockText}>
            Locked due to too many failed attempts
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 60,
  },
  form: {
    alignItems: 'center',
  },
  label: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2a2a3e',
    color: '#ffffff',
    fontSize: 32,
    padding: 20,
    borderRadius: 12,
    width: 200,
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 10,
  },
  button: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 12,
    minWidth: 200,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#4a4a5e',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  lockText: {
    fontSize: 18,
    color: '#ff6b6b',
    marginTop: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 40,
    backgroundColor: '#3a3a4e',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
