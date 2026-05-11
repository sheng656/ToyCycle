import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Success is handled by the onAuthStateChange listener in useAuthStore
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('common.welcome')}</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error || undefined}
          />

          <Button
            title={loading ? t('common.loading') : "Sign In"}
            onPress={handleLogin}
            disabled={loading}
            style={styles.loginButton}
          />

          <Button
            title="Create an Account"
            variant="ghost"
            onPress={() => router.push('/(auth)/register')}
            disabled={loading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.headlineXl,
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyLg,
    color: Colors.light.onSurfaceVariant,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
});
