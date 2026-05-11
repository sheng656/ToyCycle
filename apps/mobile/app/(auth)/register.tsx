import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      // Typically need to show a toast asking to verify email, or if auto-confirm is on, it redirects.
      // Assuming auto-confirm for now or we just let auth state change handle it.
      router.replace('/(auth)/login');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join ToyCycle community</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
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
            title={loading ? "Loading..." : "Sign Up"}
            onPress={handleRegister}
            disabled={loading}
            style={styles.registerButton}
          />

          <Button
            title="Already have an account? Sign In"
            variant="ghost"
            onPress={() => router.back()}
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
  registerButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
});
