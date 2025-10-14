import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useStore } from '../store/useStore';
import { api } from '../services/api';
import { useIdleTimer } from '../hooks/useIdleTimer';
import { Layout } from '../store/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Layout'>;
};

export default function LayoutScreen({ navigation }: Props) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedLayout, setSelectedLayout } = useStore();

  const { resetTimer } = useIdleTimer('Layout', () => {
    navigation.navigate('Attract');
  });

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      const data = await api.getLayouts();
      setLayouts(data);
    } catch (error) {
      console.error('Failed to load layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLayout = (layout: Layout) => {
    setSelectedLayout(layout);
    resetTimer();
  };

  const handleConfirm = () => {
    if (selectedLayout) {
      navigation.navigate('Capture');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Layout</Text>
      <Text style={styles.subtitle}>Select a photo layout to continue</Text>

      <FlatList
        data={layouts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedLayout?.id === item.id && styles.cardSelected,
            ]}
            onPress={() => handleSelectLayout(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.cardShots}>{item.shots} photos</Text>
              <Text style={styles.cardPrice}>${(item.price / 100).toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmButton, !selectedLayout && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={!selectedLayout}
        >
          <Text style={styles.confirmButtonText}>Confirm Layout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 30,
  },
  grid: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 20,
    minHeight: 200,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#ff6b6b',
    backgroundColor: '#3a3a4e',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 12,
  },
  cardShots: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
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
  confirmButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 250,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#4a4a5e',
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
