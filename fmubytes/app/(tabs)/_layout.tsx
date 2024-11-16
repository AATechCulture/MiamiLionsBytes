// (tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, View, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import { theme } from '@/theme';
import { Header } from '@/components/Header';

function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}


export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.tint,
          tabBarInactiveTintColor: theme.colors.tabIconDefault,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.surfaceSecondary,
            borderTopColor: theme.colors.buttonSecondary.border,
          },
          tabBarLabelStyle: {
            ...theme.typography.button,
            fontSize: 12,
          },
          tabBarItemStyle: {
            padding: theme.spacing.xs,
          },
          tabBarIconStyle: {
            marginTop: theme.spacing.xs,
          },
          tabBarHideOnKeyboard: true
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'home' : 'home-outline'}
                color={color} />
            ),
          }} />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'settings' : 'settings-outline'}
                color={color} />
            ),
          }} />
      </Tabs>
    </View>
  );
}


const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: Platform.OS === 'ios' || 'android' ? 50 : 20, // Adjusted for safe area
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    height: 40,
    width: 150,
    resizeMode: 'contain',
  },
});



