import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<{
    full_name: string;
    avatar_url: string | null;
    location_lat: number | null;
    location_lng: number | null;
  }>({
    full_name: '',
    avatar_url: null,
    location_lat: null,
    location_lng: null,
  });

  useEffect(() => {
    if (user) getProfile();
  }, [user]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, location_lat, location_lng')
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          avatar_url: data.avatar_url,
          location_lat: data.location_lat,
          location_lng: data.location_lng,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setUpdating(true);
      if (!user) throw new Error('No user on the session!');

      const updates = {
        id: user.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setUpdating(false);
    }
  }

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true, // We might need base64 depending on how we upload to Supabase Storage
      });

      if (!result.canceled && result.assets[0].base64) {
        // Here we would upload to Supabase Storage and get the public URL.
        // For simplicity right now, we could assume it's uploading and set the URL.
        // Real implementation requires uploading the image buffer to supabase storage.
        Alert.alert('Upload', 'Image picking works. Need storage implementation.');
        // setProfile(prev => ({ ...prev, avatar_url: 'new_url' }));
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error picking image');
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <Avatar size={100} url={profile.avatar_url} />
        <Button
          title="Change Avatar"
          variant="ghost"
          onPress={pickImage}
          style={styles.changeAvatarBtn}
        />
      </View>

      <View style={styles.formSection}>
        <Input
          label="Full Name"
          value={profile.full_name}
          onChangeText={(text) => setProfile((prev) => ({ ...prev, full_name: text }))}
        />
        <Input
          label="Email"
          value={user?.email || ''}
          editable={false}
          style={{ opacity: 0.6 }}
        />
      </View>

      <Button
        title={updating ? 'Updating...' : 'Update Profile'}
        onPress={updateProfile}
        disabled={updating}
        style={styles.updateButton}
      />

      <Button
        title="Sign Out"
        variant="secondary"
        onPress={() => signOut()}
        style={styles.signOutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2, // Leave space for TabBar
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  changeAvatarBtn: {
    marginTop: Spacing.sm,
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  updateButton: {
    marginBottom: Spacing.md,
  },
  signOutButton: {
    backgroundColor: Colors.light.errorContainer,
  },
});
