import ChatBot from '@/components/ChatBot/ChatBot';
import { theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Pressable, Linking, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/shared/Text'
import { AudioTranscriptionTicker } from '@/components/AudioTranscription';
import { generateLegalChecklist } from '@/services/openai';
import { LegalChecklist } from '@/components/LegalChecklist';
import { Checklist } from '@/utils/types';
// import AsyncStorage from '@react-native-async-storage/async-storage'; **would use in prod


export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [isRecording, setIsRecording] = useState(false); // Add this state

  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showFab, setShowFab] = useState(false);

  const fabAnimation = useRef(new Animated.Value(0)).current;
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const welcomeBottomSheetRef = useRef<BottomSheet>(null);

  const [legalChecklist, setLegalChecklist] = useState<Checklist | null>(null);
  const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);
  const checklistAnimation = useRef(new Animated.Value(0)).current;


  const handleBottomSheetChange = (index: number) => {
    if (index === -1) {
      setIsBottomSheetOpen(false);
      // Show FAB immediately when bottom sheet starts closing
      setShowFab(true);
      // Animate the FAB back in
      Animated.spring(fabAnimation, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else if (index === 0) {
      // Hide FAB when bottom sheet is fully opened
      setShowFab(false);
    }
  };

  const renderFab = () => {
    if (!showFab) return null;

    return (
      <AnimatedPressable
        onPress={handleFabPress}
        style={[
          styles.fab,
          {
            bottom: insets.bottom + 20,
            transform: [
              { scale: fabAnimation },
              {
                translateY: fabAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                })
              }
            ],
            opacity: fabAnimation
          }
        ]}
      >
        <Ionicons
          name="chatbubble-ellipses"
          size={24}
          color={theme.colors.buttonPrimary.text}
        />
      </AnimatedPressable>
    );
  };

  const handleFabPress = () => {
    // Hide FAB immediately
    setShowFab(false);
    setIsBottomSheetOpen(true);
    // Expand bottom sheet
    bottomSheetRef.current?.expand();
  };


  const handleTranscriptionComplete = async (text: string) => {
    try {
      setIsGeneratingChecklist(true);
      setIsRecording(false);
      const checklist = await generateLegalChecklist(text);
      setLegalChecklist(checklist);
      Animated.spring(checklistAnimation, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error processing transcription:', error);
    } finally {
      setIsGeneratingChecklist(false);
    }
  };


  const renderBottomSheet = () => {
    if (!isBottomSheetOpen) return null;

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['99%']}
        enablePanDownToClose={true}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetContent}
        enableDynamicSizing={false}
        enableOverDrag={false}
        onChange={handleBottomSheetChange}
      >
        <ChatBot isBottomSheetOpen={isBottomSheetOpen} />
      </BottomSheet>
    );
  };

  const handleRecordingStateChange = (isRecording: boolean) => {
    setIsRecording(isRecording);
    if (isRecording) {
      // Reset checklist when starting new recording
      setLegalChecklist(null);
      // Reset animation value
      checklistAnimation.setValue(0);
    }
  };



  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    // In production, would use AsyncStorage here
    // For now just showing the welcome dialog
    setShowWelcomeDialog(true);
    setShowFab(false);
  };

  const handleGetStarted = async () => {
    // In production, would set AsyncStorage here
    setShowWelcomeDialog(false);

    // Add a slight delay before showing the FAB
    setTimeout(() => {
      setShowFab(true);
      animateFab();
    }, 300); // Small delay for better UX

  };

  // Remove the useEffect that automatically animates the FAB
  // Instead, we'll only animate it when handleGetStarted is called

  const animateFab = () => {
    Animated.spring(fabAnimation, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };


  return (
    <>
      <AudioTranscriptionTicker
        onTranscriptionComplete={handleTranscriptionComplete}
        isAnalyzing={isGeneratingChecklist}
        onRecordingStateChange={handleRecordingStateChange}
      />
      {isGeneratingChecklist && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Analyzing audio...</Text>
        </View>
      )}

      {/* Only show checklist if we have one AND we're not recording */}
      {legalChecklist && !isGeneratingChecklist && !isRecording && (
        <Animated.View
          style={[
            styles.checklistContainer,
            {
              opacity: checklistAnimation,
              transform: [{
                translateY: checklistAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
            },
          ]}
        >
          <LegalChecklist
            checklist={legalChecklist}
            isFromTranscription={true} // Add this prop
          />
        </Animated.View>
      )}


      {showWelcomeDialog && (
        <BottomSheet
          ref={welcomeBottomSheetRef}
          index={0}
          snapPoints={['60%']}
          enablePanDownToClose={false}
          handleIndicatorStyle={styles.handleIndicator}
          backgroundStyle={styles.bottomSheetContent}
          enableDynamicSizing={false}
          enableOverDrag={false}
          onClose={() => setShowFab(true)}
        >
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome</Text>
            <Text style={styles.welcomeText}>
              Your privacy matters to us. We're committed to protecting your personal data in partnership with TERADATA.{'\n\n'}
              By continuing to use this app, you acknowledge and agree to our{'\n'}
              <Text
                style={styles.inlineLink}
                onPress={() => Linking.openURL('your-terms-url')}
              >
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text
                style={styles.inlineLink}
                onPress={() => Linking.openURL('your-privacy-url')}
              >
                Privacy Policy
              </Text>
              .{'\n\n'}
              <Text style={styles.disclaimer}>
                Disclaimer: The content provided in this app is for informational purposes only and does not constitute legal advice. For legal matters, please consult with a qualified attorney.
              </Text>
            </Text>
            <Pressable
              style={styles.getStartedButton}
              onPress={handleGetStarted}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </Pressable>
          </View>
        </BottomSheet>
      )}
      {renderFab()}
      {renderBottomSheet()}
    </>
  );
}


const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    minHeight: '100%',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.icon,
    marginBottom: theme.spacing.xl,
  },
  indicator: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginVertical: theme.spacing.lg,
    backgroundColor: theme.colors.buttonSecondary.border,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl * 2,
    right: theme.spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.buttonPrimary.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    zIndex: 4
  },
  fabIcon: {
    tintColor: theme.colors.buttonPrimary.text,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  handleIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.icon,
    marginBottom: theme.spacing.md,
    opacity: 0.2,
  },
  bottomSheetContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  cardContainer: {
    backgroundColor: theme.colors.buttonSecondary.background,
    borderRadius: 12,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.buttonSecondary.border,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    ...theme.typography.body,
    color: theme.colors.icon,
  },
  welcomeContainer: {
    padding: theme.spacing.layout.padding,
    alignItems: 'center',
  },
  welcomeTitle: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  welcomeText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  inlineLink: {
    ...theme.typography.link,
    color: theme.colors.primary,
  },
  getStartedButton: {
    backgroundColor: theme.colors.buttonPrimary.background,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    width: '100%',
  },
  getStartedButtonText: {
    ...theme.typography.button,
    color: theme.colors.buttonPrimary.text,
    textAlign: 'center',
  },
  disclaimer: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  checklistContainer: {
    flex: 1,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.layout.padding,
  },
});