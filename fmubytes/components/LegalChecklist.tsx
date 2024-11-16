import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Linking,
  Modal,
} from 'react-native';
import { Text } from '@/components/shared/Text';
import { theme } from '@/theme';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { ChecklistItem, ChecklistProps } from '@/utils/types';
import { getItemDisplayProperties } from '@/utils/checklist-helpers';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface LegalChecklistProps extends ChecklistProps {
  isFromTranscription?: boolean;
}


export const LegalChecklist: React.FC<LegalChecklistProps> = ({ checklist, isFromTranscription = false }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);


  // Group items by timeframe
  const groupedItems = checklist.items.reduce((acc, item) => {
    const timeframe = item.timeframe;
    if (!acc[timeframe]) {
      acc[timeframe] = [];
    }
    acc[timeframe].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const toggleItem = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const EmergencyHelpButton = () => {
    const handleEmergencyPress = async () => {


      setShowEmergencyModal(true);
    };

    const handleCallEmergency = () => {
      // Simulate calling emergency number
      Linking.openURL('tel:1-800-999-9999');
      setShowEmergencyModal(false);
    };

    return (
      <>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyPress}
        >
          <LinearGradient
            colors={[theme.colors.status.error, theme.colors.accent]}
            style={styles.emergencyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.emergencyContent}>
              <FontAwesome5 name="hands-helping" size={24} color="white" />
              <Text style={styles.emergencyText}>Need Immediate Help?</Text>
              <Text style={styles.emergencySubtext}>24/7 Legal Support Available</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <Modal
          visible={showEmergencyModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEmergencyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={[theme.colors.status.error, theme.colors.accent]}
                style={styles.modalGradient}
              >
                <View style={styles.modalHeader}>
                  <FontAwesome5 name="exclamation-triangle" size={32} color="white" />
                  <Text style={styles.modalTitle}>Emergency Legal Support</Text>
                </View>

                <Text style={styles.modalDescription}>
                  You'll be connected with our 24/7 emergency legal support team immediately.
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={() => setShowEmergencyModal(false)}
                  >
                    <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={handleCallEmergency}
                  >
                    <Text style={styles.modalButtonTextPrimary}>Call Now</Text>
                    <FontAwesome5 name="phone" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  // Progress Indicator Component
  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <LinearGradient
        colors={[`${theme.colors.primary}20`, `${theme.colors.primary}40`]}
        style={styles.progressGradient}
      >
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Your Legal Journey</Text>
          <Text style={styles.progressPercentage}>45% Complete</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: '45%' }]} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  // Help Resources Section
  const HelpResources = () => (
    <View style={styles.helpResourcesContainer}>
      <Text style={styles.helpResourcesTitle}>Available Resources</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['Pro Bono Services', 'Legal Aid', 'Document Help', 'Consultation'].map((resource, index) => (
          <TouchableOpacity key={index} style={styles.resourceCard}>
            <LinearGradient
              colors={[theme.colors.primaryLight, theme.colors.primary]}
              style={styles.resourceGradient}
            >
              <FontAwesome5 name="hands-helping" size={24} color="white" />
              <Text style={styles.resourceText}>{resource}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Enhanced Checklist Item
  const renderChecklistItem = (item: ChecklistItem) => {
    const displayProps = getItemDisplayProperties(item);
    const isExpanded = expandedItems.includes(item.id);

    return (
      <Animated.View key={item.id} style={[styles.itemContainer]}>
        <LinearGradient
          colors={[
            isExpanded ? `${theme.colors.primary}15` : theme.colors.backgroundSecondary,
            isExpanded ? `${theme.colors.primary}25` : `${theme.colors.primary}05`
          ]}
          style={[styles.itemGradient, isExpanded && styles.expandedGradient]}
        >
          <TouchableOpacity
            onPress={() => toggleItem(item.id)}
            style={styles.itemTouchable}
          >
            <View style={styles.mainContent}>
              <View style={styles.headerContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.badgesContainer}>
                  <View style={[styles.badge, { backgroundColor: displayProps.priorityColor }]}>
                    <MaterialCommunityIcons
                      name={displayProps.priority === 'high' ? 'alert-circle' : 'information'}
                      size={16}
                      color="white"
                    />
                    <Text style={styles.badgeText}>{displayProps.priorityLabel}</Text>
                  </View>

                  <View style={styles.timeframeBadge}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                    <Text style={styles.timeframeText}>{displayProps.timeframeLabel}</Text>
                  </View>
                </View>
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.description}>{item.description}</Text>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton}>
                      <LinearGradient
                        colors={[theme.colors.primary, theme.colors.primaryDark]}
                        style={styles.actionGradient}
                      >
                        <Ionicons name="document-text" size={20} color="white" />
                        <Text style={styles.actionText}>View Details</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                      <LinearGradient
                        colors={[theme.colors.status.success, theme.colors.primaryDark]}
                        style={styles.actionGradient}
                      >
                        <Ionicons name="chatbubbles" size={20} color="white" />
                        <Text style={styles.actionText}>Get Help</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {isFromTranscription ? (
        // When coming from transcription, show checklist first
        <>
          <View style={styles.checklistContainer}>
            {Object.entries(groupedItems).map(([timeframe, items]) => (
              <View key={timeframe} style={styles.timeframeSection}>
                <Text style={styles.timeframeHeader}>
                  {getItemDisplayProperties({ timeframe } as any).timeframeLabel}
                </Text>
                {items.map(renderChecklistItem)}
              </View>
            ))}
          </View>
          <EmergencyHelpButton />
        </>
      ) : (
        // Normal flow - show help resources first
        <>
          <EmergencyHelpButton />
          <ProgressIndicator />
          <HelpResources />
          <View style={styles.checklistContainer}>
            {Object.entries(groupedItems).map(([timeframe, items]) => (
              <View key={timeframe} style={styles.timeframeSection}>
                <Text style={styles.timeframeHeader}>
                  {getItemDisplayProperties({ timeframe } as any).timeframeLabel}
                </Text>
                {items.map(renderChecklistItem)}
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  emergencyButton: {
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    elevation: 5,
  },
  emergencyGradient: {
    padding: theme.spacing.lg,
  },
  emergencyContent: {
    alignItems: 'center',
  },
  emergencyAnimation: {
    width: 60,
    height: 60,
  },
  emergencyText: {
    ...theme.typography.h3,
    color: 'white',
    textAlign: 'center',
  },
  emergencySubtext: {
    ...theme.typography.bodySmall,
    color: 'white',
    opacity: 0.9,
  },
  progressContainer: {
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
  },
  progressPercentage: {
    ...theme.typography.bodyBold,
    color: theme.colors.primary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    flex: 1,
    backgroundColor: `${theme.colors.primary}40`,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  helpResourcesContainer: {
    margin: theme.spacing.md,
  },
  helpResourcesTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  resourceCard: {
    width: width * 0.4,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  resourceGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  resourceText: {
    ...theme.typography.bodyBold,
    color: 'white',
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  checklistContainer: {
    padding: theme.spacing.md,
  },
  timeframeSection: {
    marginBottom: theme.spacing.xl,
  },
  timeframeHeader: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  itemContainer: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemGradient: {
    borderRadius: theme.borderRadius.lg,
  },
  expandedGradient: {
    padding: theme.spacing.xs,
  },
  itemTouchable: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    marginRight: theme.spacing.md,
  },
  statusAnimation: {
    width: '100%',
    height: '100%',
  },
  mainContent: {
    flex: 1,
  },
  headerContent: {
    marginBottom: theme.spacing.md,
  },
  itemTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  badgeText: {
    ...theme.typography.captionBold,
    color: 'white',
  },
  timeframeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: `${theme.colors.primary}15`,
    gap: 4,
  },
  timeframeText: {
    ...theme.typography.captionBold,
    color: theme.colors.primary,
  },
  expandedContent: {
    marginTop: theme.spacing.md,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  actionText: {
    ...theme.typography.buttonSmall,
    color: 'white',
  },
  summaryContainer: {
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: `${theme.colors.primary}10`,
  },
  summaryContent: {
    padding: theme.spacing.lg,
  },
  summaryText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: `${theme.colors.text}10`,
    marginVertical: theme.spacing.md,
  },
  helpSection: {
    padding: theme.spacing.md,
  },
  helpHeader: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  helpCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  helpCard: {
    flex: 1,
    minWidth: width * 0.4,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  helpCardGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  helpCardText: {
    ...theme.typography.bodyBold,
    color: 'white',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  floatingHelpButton: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  floatingHelpIcon: {
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalGradient: {
    padding: theme.spacing.xl,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: 'white',
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  modalDescription: {
    ...theme.typography.body,
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  modalButtonPrimary: {
    backgroundColor: 'white',
  },
  modalButtonSecondary: {
    borderWidth: 1,
    borderColor: 'white',
  },
  modalButtonTextPrimary: {
    ...theme.typography.buttonSmall,
    color: theme.colors.status.error,
  },
  modalButtonTextSecondary: {
    ...theme.typography.buttonSmall,
    color: 'white',
  },
})
