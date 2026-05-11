import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Chip } from '../../components/ui/Chip';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';
import { TOY_CATEGORIES, TOY_CONDITIONS, AGE_RANGES } from '@toycycle/shared';

export default function PublishScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('other');
  const [condition, setCondition] = useState<string>('used');
  const [ageRange, setAgeRange] = useState<string>('3-6');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 3,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(a => a.uri);
        setImages([...images, ...newImages].slice(0, 3)); // Max 3 images
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const uploadImage = async (uri: string) => {
    const fileName = uri.split('/').pop();
    const fileExt = fileName?.split('.').pop();
    const path = `${user?.id}/${Date.now()}.${fileExt}`;

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: fileName,
      type: `image/${fileExt}`,
    } as any);

    const { data, error } = await supabase.storage
      .from('toy-images')
      .upload(path, formData);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('toy-images')
      .getPublicUrl(path);

    return publicUrl;
  };

  const handlePublish = async () => {
    if (!title || !description || images.length === 0) {
      Alert.alert('Error', 'Please fill all fields and add at least one image.');
      return;
    }

    try {
      setLoading(true);
      
      const uploadedUrls = await Promise.all(images.map(uploadImage));

      // We also need location. Mocking or fetching from user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('latitude, longitude') // Fixed field names to match types.ts
        .eq('id', user?.id)
        .single();

      const { data, error } = await supabase.from('toys').insert({
        owner_id: user?.id,
        title,
        description,
        category,
        condition,
        age_range: ageRange,
        images: uploadedUrls,
        status: 'available',
        estimated_value: 10, // Default for MVP
        latitude: profile?.latitude || -36.8485,
        longitude: profile?.longitude || 174.7633,
      }).select().single();

      if (error) throw error;

      Alert.alert('Success', 'Toy published successfully!');
      router.replace('/(tabs)');
      
      // Reset form
      setTitle('');
      setDescription('');
      setImages([]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>{t('tabs.publish')}</Text>

      {/* Image Picker */}
      <Text style={styles.sectionTitle}>Photos (Max 3)</Text>
      <View style={styles.imageRow}>
        {images.map((uri, idx) => (
          <TouchableOpacity key={idx} onPress={() => removeImage(idx)} style={styles.imagePreview}>
            <Image source={{ uri }} style={styles.image} />
            <View style={styles.removeIcon}><Text style={styles.removeText}>X</Text></View>
          </TouchableOpacity>
        ))}
        {images.length < 3 && (
          <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      <Input label="Title" value={title} onChangeText={setTitle} placeholder="What is it?" />
      <Input label="Description" value={description} onChangeText={setDescription} multiline numberOfLines={4} style={{ height: 100 }} />

      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.chipGroup}>
        {Object.entries(TOY_CATEGORIES).map(([key, emoji]) => (
          <TouchableOpacity key={key} onPress={() => setCategory(key)}>
            <Chip 
              label={`${emoji} ${key}`} 
              color={category === key ? Colors.light.primary : Colors.light.surfaceContainerHigh} 
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Condition</Text>
      <View style={styles.chipGroup}>
        {TOY_CONDITIONS.map((cond) => (
          <TouchableOpacity key={cond} onPress={() => setCondition(cond)}>
            <Chip 
              label={cond.replace('_', ' ')} 
              color={condition === cond ? Colors.light.secondary : Colors.light.surfaceContainerHigh} 
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Age Range</Text>
      <View style={styles.chipGroup}>
        {AGE_RANGES.map((age) => (
          <TouchableOpacity key={age} onPress={() => setAgeRange(age)}>
            <Chip 
              label={age} 
              color={ageRange === age ? Colors.light.tertiary : Colors.light.surfaceContainerHigh} 
            />
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title={loading ? "Publishing..." : "Publish Toy"}
        onPress={handlePublish}
        disabled={loading}
        style={styles.submitBtn}
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
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  headerTitle: {
    ...Typography.headlineLg,
    color: Colors.light.primary,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.labelMd,
    color: Colors.light.onSurface,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  imageRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 32,
    color: Colors.light.outline,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  submitBtn: {
    marginTop: Spacing.lg,
  },
});
