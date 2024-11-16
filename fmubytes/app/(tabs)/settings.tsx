
// SettingsScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { Text } from '@/components/shared/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showBorder?: boolean;
}

interface SettingToggleProps extends SettingItemProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ProfileSection = () => (
  <LinearGradient
    colors={[theme.colors.background, theme.colors.primary]}
    style={styles.profileGradient}
    accessible={true}
    accessibilityLabel="Profile section"
  >
    <View style={styles.profileSection}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
          accessible={true}
          accessibilityLabel="Profile picture"
        />
        <TouchableOpacity
          style={styles.editProfileImageButton}
          accessible={true}
          accessibilityLabel="Change profile picture"
        >
          <Ionicons name="camera" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.profileName}>Sarah Johnson</Text>
      <Text style={styles.profileEmail}>sarah.j@legalai.com</Text>
      <View style={styles.profileBadgesContainer}>
        <LinearGradient
          colors={[theme.colors.primaryDark, theme.colors.primary]}
          style={styles.subscriptionBadge}
        >
          <Ionicons name="shield-checkmark" size={16} color="white" />
          <Text style={styles.subscriptionText}>Legal Aid Eligible</Text>
        </LinearGradient>
      </View>
    </View>
  </LinearGradient>
);

const EmergencyHelp = () => (
  <View style={styles.emergencySection}>
    <Text style={styles.emergencyTitle}>Need Immediate Legal Help?</Text>
    <LinearGradient
      colors={[theme.colors.status.error, theme.colors.accent]}
      style={styles.emergencyButton}
    >
      <Ionicons name="call" size={24} color="white" />
      <View>
        <Text style={styles.emergencyButtonText}>Emergency Legal Hotline</Text>
        <Text style={styles.emergencyButtonSubtext}>24/7 Free Legal Support</Text>
      </View>
    </LinearGradient>
  </View>
);

const QuickActions = () => (
  <View style={styles.quickActionsContainer}>
    <Text style={styles.quickActionsTitle}>Legal Resources</Text>
    <View style={styles.quickActionsGrid}>
      {[
        { icon: 'document-text', title: 'My Documents' },
        { icon: 'calendar', title: 'Appointments' },
        { icon: 'shield-checkmark', title: 'Rights Guide' },
        { icon: 'search', title: 'Find Lawyer' },
        { icon: 'library', title: 'Legal Forms' },
        { icon: 'people', title: 'Support Group' },
      ].map((action, index) => (
        <TouchableOpacity
          key={index}
          style={styles.quickActionButton}
          accessible={true}
          accessibilityLabel={`${action.title} button`}
        >
          <LinearGradient
            colors={[`${theme.colors.primary}20`, `${theme.colors.primary}40`]}
            style={styles.quickActionGradient}
          >
            <Ionicons name={action.icon as any} size={24} color={theme.colors.primary} />
            <Text style={styles.quickActionText}>{action.title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);


const SettingItem: React.FC<SettingItemProps> = ({ icon, title, subtitle, onPress, showBorder = true }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.settingItem, showBorder && styles.settingItemBorder]}
  >
    <View style={styles.settingItemLeft}>
      <LinearGradient
        colors={[theme.colors.primary, `${theme.colors.primaryDark}80`]}
        style={styles.iconContainer}
      >
        <Ionicons name={icon} size={20} color="white" />
      </LinearGradient>
      <View style={styles.settingItemText}>
        <Text style={styles.settingItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
  </TouchableOpacity>
);

const SettingToggle: React.FC<SettingToggleProps> = ({ icon, title, subtitle, value, onValueChange, showBorder = true }) => (
  <View style={[styles.settingItem, showBorder && styles.settingItemBorder]}>
    <View style={styles.settingItemLeft}>
      <LinearGradient
        colors={[theme.colors.primary, `${theme.colors.primaryDark}80`]}
        style={styles.iconContainer}
      >
        <Ionicons name={icon} size={20} color="white" />
      </LinearGradient>
      <View style={styles.settingItemText}>
        <Text style={styles.settingItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
      thumbColor={theme.colors.background}
    />
  </View>
);

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel="Settings screen"
      >
        <ProfileSection />
        <EmergencyHelp />
        <QuickActions />

        <Animated.View entering={FadeInDown.delay(200)}>
          <View style={styles.settingsContainer}>
            {/* Legal Aid Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Legal Aid Settings</Text>
              <View style={styles.sectionContent}>
                <SettingItem
                  icon="briefcase"
                  title="Case Information"
                  subtitle="View and update your case details"
                  onPress={() => { }}
                />
                <SettingItem
                  icon="document-text"
                  title="Income Verification"
                  subtitle="Update your eligibility status"
                  onPress={() => { }}
                />
                <SettingItem
                  icon="people"
                  title="Legal Representative"
                  subtitle="Manage your legal team"
                  onPress={() => { }}
                  showBorder={false}
                />
              </View>
            </View>

            {/* Communication Preferences */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Communication</Text>
              <View style={styles.sectionContent}>
                <SettingToggle
                  icon="notifications"
                  title="Case Updates"
                  subtitle="Get notified about your case"
                  value={notifications}
                  onValueChange={setNotifications}
                  onPress={() => { }}
                />
                <SettingItem
                  icon="language"
                  title="Language"
                  subtitle="Choose your preferred language"
                  onPress={() => { }}
                  showBorder={false}
                />
              </View>
            </View>

            {/* Accessibility Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Accessibility</Text>
              <View style={styles.sectionContent}>
                <SettingToggle
                  icon="moon"
                  title="High Contrast Mode"
                  subtitle="Make text easier to read"
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  onPress={() => { }}
                />
                <SettingItem
                  icon="text"
                  title="Text Size"
                  subtitle="Adjust reading comfort"
                  onPress={() => { }}
                  showBorder={false}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        <TouchableOpacity
          style={styles.helpButton}
          accessible={true}
          accessibilityLabel="Get help with the app"
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            style={styles.helpGradient}
          >
            <Ionicons name="help-circle" size={20} color="white" />
            <Text style={styles.helpText}>Need Help Using the App?</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          accessible={true}
          accessibilityLabel="Log out of your account"
        >
          <LinearGradient
            colors={[theme.colors.status.error, theme.colors.accent]}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out" size={20} color="white" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileGradient: {
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  editProfileImageButton: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.md,
  },
  profileName: {
    ...theme.typography.h2,
    color: theme.colors.background,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    ...theme.typography.bodySmall,
    color: theme.colors.background,
    opacity: 0.8,
  },
  profileBadgesContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  subscriptionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.background,
    fontWeight: '600',
  },
  emergencySection: {
    padding: theme.spacing.layout.padding,
    marginBottom: theme.spacing.md,
  },
  emergencyTitle: {
    ...theme.typography.h3,
    color: theme.colors.status.error,
    marginBottom: theme.spacing.sm,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
  },
  emergencyButtonText: {
    ...theme.typography.bodyBold,
    color: theme.colors.background,
  },
  emergencyButtonSubtext: {
    ...theme.typography.caption,
    color: theme.colors.background,
    opacity: 0.9,
  },
  quickActionsContainer: {
    padding: theme.spacing.layout.padding,
  },
  quickActionsTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '30%', // Changed to allow 3 items per row
  },
  quickActionGradient: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minHeight: 100, // Ensure consistent height
  },
  quickActionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  settingsContainer: {
    padding: theme.spacing.layout.padding,
  },
  settingsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.overline,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  sectionContent: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItemText: {
    flex: 1,
  },
  settingItemTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  settingItemSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  helpButton: {
    margin: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  helpGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  helpText: {
    ...theme.typography.button,
    color: theme.colors.background,
  },
  logoutButton: {
    margin: theme.spacing.xl,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  logoutText: {
    ...theme.typography.button,
    color: theme.colors.background,
  },
  // Additional accessibility-focused styles
  accessibilityHint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  highContrastText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  touchableArea: {
    minHeight: 44, // Minimum touch target size
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.bodySmall,
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
  },
  successText: {
    ...theme.typography.bodySmall,
    color: theme.colors.status.success,
    marginTop: theme.spacing.xs,
  },
});