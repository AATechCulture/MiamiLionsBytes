import { View, Image, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const LANGUAGES: Array<{
  code: string;
  name: string;
  flag: string;
}> = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: "ht", name: "Kreyòl Ayisyen", flag: "🇭🇹" }
];

export const Header = () => {
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES[0]);
  const [isLanguageMenuVisible, setIsLanguageMenuVisible] = useState(false);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.rightSection}>
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
            onPress={() => {/*  Handle search  */}}
          >
            <Ionicons
              name="search-outline"
              size={24}
              color={theme.colors.text}
            />
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
            onPress={() => {/*  Handle files  */}}
          >
            <Ionicons
              name="document-text-outline"
              size={24}
              color={theme.colors.text}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.languageButton,
              pressed && styles.iconButtonPressed,
            ]}
            onPress={() => setIsLanguageMenuVisible(!isLanguageMenuVisible)}
          >
            <Text style={styles.flagText}>{currentLanguage.flag}</Text>
            <Ionicons
              name="chevron-down-outline"
              size={16}
              color={theme.colors.text}
            />
          </Pressable>

          {isLanguageMenuVisible && (
            <View style={styles.languageMenu}>
              {LANGUAGES.map((language) => (
                <Pressable
                  key={language.code}
                  style={({ pressed }) => [
                    styles.languageMenuItem,
                    pressed && styles.languageMenuItemPressed,
                  ]}
                  onPress={() => {
                    setCurrentLanguage(language);
                    setIsLanguageMenuVisible(false);
                  }}
                >
                  <Text style={styles.flagText}>{language.flag}</Text>
                  <Text style={styles.languageText}>{language.name}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    zIndex: 3
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.layout.padding,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    opacity: .95
  },
  leftSection: {
    justifyContent: 'flex-start',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  logo: {
    height: 40,
    width: 120,
  },
  iconButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  iconButtonPressed: {
    opacity: 0.7,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceSecondary,
    gap: theme.spacing.xs,
  },
  flagText: {
    fontSize: 16,
  },
  languageMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
    zIndex: 1000,
  },
  languageMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
    minWidth: 160,
  },
  languageMenuItemPressed: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  languageText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});