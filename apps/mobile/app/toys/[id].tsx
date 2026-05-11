import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Chip } from '../../components/ui/Chip';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';
import { TOY_CATEGORIES } from '@toycycle/shared';

export default function ToyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [toy, setToy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchToyDetails();
  }, [id]);

  const fetchToyDetails = async () => {
    try {
      // Assuming 'profiles' table relationship is configured in Supabase 
      // If not, we might need a separate query for the owner profile.
      const { data, error } = await supabase
        .from('toys')
        .select(`
          *,
          owner:profiles!toys_owner_id_fkey(id, full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) {
        // Fallback if relation fails
        const fallbackData = await supabase.from('toys').select('*').eq('id', id).single();
        const ownerData = await supabase.from('profiles').select('*').eq('id', fallbackData.data.owner_id).single();
        setToy({ ...fallbackData.data, owner: ownerData.data });
      } else {
        setToy(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestExchange = async () => {
    if (!user) {
      Alert.alert('Authentication required', 'Please sign in to request an exchange.');
      return;
    }

    if (user.id === toy.owner_id) {
      Alert.alert('Invalid action', 'You cannot exchange your own toy.');
      return;
    }

    try {
      const { error } = await supabase.from('exchange_requests').insert({
        requester_id: user.id,
        toy_id: toy.id,
        owner_id: toy.owner_id,
        status: 'pending',
        credits_amount: toy.estimated_value || 10,
      });

      if (error) throw error;

      Alert.alert('Success', 'Exchange request sent successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send request');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!toy) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Toy not found.</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const emoji = TOY_CATEGORIES[toy.category as keyof typeof TOY_CATEGORIES] || '📦';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Images Carousel Placeholder - just showing first image for now */}
        <View style={styles.imageContainer}>
          {toy.images && toy.images.length > 0 ? (
            <Image source={{ uri: toy.images[0] }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={{ color: Colors.light.outline }}>No Image</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.chipRow}>
            <Chip label={`${emoji} ${toy.category}`} />
            <Chip label={toy.condition} color={Colors.light.secondary} />
            <Chip label={toy.age_range} color={Colors.light.tertiary} />
          </View>

          <Text style={styles.title}>{toy.title}</Text>
          <Text style={styles.description}>{toy.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Owner</Text>
          <View style={styles.ownerCard}>
            <Avatar size={48} url={toy.owner?.avatar_url} />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{toy.owner?.full_name || 'Unknown User'}</Text>
              <Text style={styles.ownerCredit}>Estimated value: {toy.estimated_value || 10} Credits</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar for Action */}
      <View style={styles.bottomBar}>
        <Button
          title="Request Exchange"
          onPress={handleRequestExchange}
          disabled={toy.status !== 'available'}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100, // Make room for floating bottom bar
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.light.surfaceContainerHigh,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.headlineLg,
    color: Colors.light.onSurface,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.bodyLg,
    color: Colors.light.onSurfaceVariant,
    marginBottom: Spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.outlineVariant,
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    ...Typography.headlineMd,
    fontSize: 18,
    color: Colors.light.onSurface,
    marginBottom: Spacing.sm,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
  },
  ownerInfo: {
    marginLeft: Spacing.md,
  },
  ownerName: {
    ...Typography.labelMd,
    fontSize: 16,
    color: Colors.light.onSurface,
  },
  ownerCredit: {
    ...Typography.bodyMd,
    color: Colors.light.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.outlineVariant,
  },
  actionButton: {
    width: '100%',
  },
});
