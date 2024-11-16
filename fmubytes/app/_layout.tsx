import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useUserStore } from '@/store/user';
import { supabase } from '@/services/supabase-client';

// Feature flags for fetching from supabase
const ENABLE_USER_FEATURES = false;
const ENABLE_PROFILE_FETCH = ENABLE_USER_FEATURES;

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  
  // Only initialize store hooks if user features are enabled
  const setProfile = ENABLE_USER_FEATURES ? useUserStore((state) => state.setProfile) : null;
  const setIsLoading = ENABLE_USER_FEATURES ? useUserStore((state) => state.setIsLoading) : null;
  const isLoading = ENABLE_USER_FEATURES ? useUserStore((state) => state.isLoading) : false;

  const [loaded] = useFonts({
    Inter: require('@/assets/fonts/Inter.ttf'),
    InterItalic: require('@/assets/fonts/Inter-Italic.ttf')
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading?.(true);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single();

        if (error) throw error;
        console.log(profile);
        setProfile?.(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading?.(false);
      }
    };

    // Only fetch profile if both flags are enabled
    if (ENABLE_USER_FEATURES && ENABLE_PROFILE_FETCH) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    if (loaded && (!ENABLE_USER_FEATURES || !isLoading)) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  if (!loaded || (ENABLE_USER_FEATURES && isLoading)) return null;

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="+not-found"
            options={{
              title: 'Not Found',
            }}
          />
        </Stack>
      </GestureHandlerRootView>
  );
}
