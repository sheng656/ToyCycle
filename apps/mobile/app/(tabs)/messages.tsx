import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../../components/ui/Avatar';
import { Chip } from '../../components/ui/Chip';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';

export default function MessagesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setRefreshing(true);
      if (!user) return;

      const { data, error } = await supabase
        .from('exchange_requests')
        .select(`
          *,
          toy:toys(title, images),
          requester:profiles!exchange_requests_requester_id_fkey(full_name, avatar_url),
          owner:profiles!exchange_requests_owner_id_fkey(full_name, avatar_url)
        `)
        .or(`requester_id.eq.${user.id},owner_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isOwner = user?.id === item.owner_id;
    const otherUser = isOwner ? item.requester : item.owner;
    const toyImage = item.toy?.images?.[0] || null;

    let statusColor = Colors.light.outline;
    if (item.status === 'pending') statusColor = Colors.light.primaryContainer;
    if (item.status === 'accepted') statusColor = Colors.light.tertiary;
    if (item.status === 'rejected') statusColor = Colors.light.error;

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push({ pathname: '/messages/[id]', params: { id: item.id } })}
      >
        <Avatar size={50} url={otherUser?.avatar_url} style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.name} numberOfLines={1}>{otherUser?.full_name || 'Unknown'}</Text>
            <Chip label={item.status} color={statusColor} style={styles.statusChip} />
          </View>
          <Text style={styles.toyTitle} numberOfLines={1}>
            {isOwner ? 'Requested your: ' : 'You requested: '}
            {item.toy?.title}
          </Text>
          <Text style={styles.metaText}>{item.credits_amount} Credits</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>{t('tabs.messages')}</Text>
      
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchRequests} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No exchange requests yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  screenTitle: {
    ...Typography.headlineLg,
    color: Colors.light.primary,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.surfaceContainerHigh,
  },
  avatar: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    ...Typography.labelMd,
    fontSize: 16,
    flex: 1,
    color: Colors.light.onSurface,
  },
  statusChip: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  toyTitle: {
    ...Typography.bodyMd,
    color: Colors.light.onSurfaceVariant,
    marginBottom: 2,
  },
  metaText: {
    ...Typography.bodyMd,
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.bodyLg,
    color: Colors.light.outline,
  },
});
