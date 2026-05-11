import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useAuthStore } from '../store/useAuthStore';
import '../i18n'; // Initialize i18n

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Quicksand-Regular': require('@expo-google-fonts/quicksand/Quicksand_400Regular.ttf'),
    'Quicksand-SemiBold': require('@expo-google-fonts/quicksand/Quicksand_600SemiBold.ttf'),
    'Quicksand-Bold': require('@expo-google-fonts/quicksand/Quicksand_700Bold.ttf'),
    'NunitoSans-Regular': require('@expo-google-fonts/nunito-sans/NunitoSans_400Regular.ttf'),
    'NunitoSans-SemiBold': require('@expo-google-fonts/nunito-sans/NunitoSans_600SemiBold.ttf'),
    'NunitoSans-Bold': require('@expo-google-fonts/nunito-sans/NunitoSans_700Bold.ttf'),
  });

  const { initialized, session, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (loaded && initialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, initialized]);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to the login page.
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Redirect away from the login page.
      router.replace('/(tabs)');
    }
  }, [session, initialized, segments]);

  if (!loaded || !initialized) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
