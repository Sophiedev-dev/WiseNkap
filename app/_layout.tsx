import { Stack } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../FistApp/src/firebase';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      SplashScreen.hideAsync();
    });

    return unsubscribe;
  }, []);

  if (loading) return null; // loader pendant splash screen

  return (
    <Stack
      initialRouteName={user ? "(tabs)" : "auth/login"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
