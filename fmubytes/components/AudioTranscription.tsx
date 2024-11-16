import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { transcribeAudio } from '../services/openai';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface AudioTranscriptionTickerProps {
    onTranscriptionComplete: (text: string) => void;
    isAnalyzing: boolean;
    onRecordingStateChange?: (isRecording: boolean) => void;
}

export const AudioTranscriptionTicker: React.FC<AudioTranscriptionTickerProps> = ({
    onTranscriptionComplete,
    isAnalyzing,
    onRecordingStateChange,
}) => {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [transcribedText, setTranscribedText] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;
    const screenWidth = Dimensions.get('window').width;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Audio status state
    const [duration, setDuration] = useState(0);
    const [audioLevel, setAudioLevel] = useState(0);

    const getStatusMessage = () => {
        if (isAnalyzing) return "Analyzing your audio...";
        if (isTranscribing) return "Converting your speech to text...";
        if (recording) return "I'm listening...";
        if (transcribedText) return "All done! Tap to record again";
        return "Tap the button below to start speaking";
    };

    const getHelpText = () => {
        if (isAnalyzing) return "Please wait while I analyze that";
        if (recording) return "Tap stop when you're finished speaking";
        if (isTranscribing) return "Just a moment while I process that";
        return "Speak clearly and I'll convert it to text";
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    // Audio status effects
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (recording) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
                setAudioLevel(Math.random() * 0.8 + 0.2);
            }, 1000);

            // Pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }

        return () => {
            if (interval) clearInterval(interval);
            pulseAnim.setValue(1);
        };
    }, [recording]);

    // Formatting helpers
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Setup audio recording permissions and configuration
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Audio.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission required', 'Please grant access to the microphone');
                    return;
                }

                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
            } catch (error) {
                console.error('Error setting up audio:', error);
            }
        })();
    }, []);

    const startRecording = async () => {
        setTranscribedText('')
        onRecordingStateChange?.(true);
        try {
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        onRecordingStateChange?.(false);
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            if (uri) {
                setIsTranscribing(true);
                try {
                    const transcription = await transcribeAudio(uri);
                    setTranscribedText(transcription);
                    if (onTranscriptionComplete) {
                        onTranscriptionComplete(transcription);
                    }
                } catch (error) {
                    console.error('Transcription error:', error);
                    Alert.alert('Error', 'Failed to transcribe audio');
                } finally {
                    setIsTranscribing(false);
                }
            }
        } catch (err) {
            console.error('Failed to stop recording', err);
            Alert.alert('Error', 'Failed to stop recording');
        }
    };



    // Animate the ticker
    useEffect(() => {
        if (transcribedText) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scrollX, {
                        toValue: -screenWidth,
                        duration: 20000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scrollX, {
                        toValue: screenWidth,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [transcribedText]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Enhanced Status Card with Gradient Background */}
            <LinearGradient
                colors={[theme.colors.primaryDark + '10', theme.colors.background]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statusCard}
            >
                {/* Status Icon */}
                <Animated.View style={[styles.statusIconContainer,
                recording && { transform: [{ scale: pulseAnim }] }
                ]}>
                    <LinearGradient
                        colors={recording
                            ? [theme.colors.status.error, theme.colors.status.error + '80']
                            : [theme.colors.primary, theme.colors.primaryDark]
                        }
                        style={styles.statusIconGradient}
                    >
                        <Ionicons
                            name={recording ? "radio" : "mic"}
                            size={28}
                            color="white"
                        />
                    </LinearGradient>
                </Animated.View>
                <View style={styles.statusContent}>
                    <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
                    <Text style={styles.helpText}>{getHelpText()}</Text>
                </View>

                {recording && (
                    <Animated.View style={styles.recordingStats}>
                        <Text style={styles.timer}>{formatDuration(duration)}</Text>
                        <View style={styles.visualizerContainer}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                style={styles.visualizerBackground}
                            >
                                <View style={styles.visualizer}>
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <Animated.View
                                            key={i}
                                            style={[
                                                styles.visualizerBar,
                                                {
                                                    height: 4 + (Math.sin(i / 4) * 30),
                                                    opacity: audioLevel > (i / 40) ? 1 : 0.3,
                                                    backgroundColor: recording
                                                        ? theme.colors.status.error
                                                        : theme.colors.primary,
                                                }
                                            ]}
                                        />
                                    ))}
                                </View>
                            </LinearGradient>
                        </View>
                    </Animated.View>
                )}
            </LinearGradient>

            {/* Transcription Result with Blur Background */}
            {transcribedText && (
                <BlurView intensity={80} style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                        <Ionicons name="document-text" size={20} color={theme.colors.primary} />
                        <Text style={styles.resultTitle}>Transcription</Text>
                    </View>
                    <Text style={styles.transcribedText}>{transcribedText}</Text>
                </BlurView>
            )}

            {/* Floating Action Button */}
            {(!isTranscribing && !isAnalyzing) && (
                <TouchableOpacity
                    style={[
                        styles.mainButton,
                        recording && styles.stopButton,
                        isTranscribing && styles.disabledButton
                    ]}
                    onPress={recording ? stopRecording : startRecording}
                    disabled={isTranscribing}
                >
                    <LinearGradient
                        colors={recording
                            ? [theme.colors.status.error, theme.colors.status.error]
                            : [theme.colors.primary, theme.colors.primaryDark]
                        }
                        style={styles.buttonGradient}
                    >
                        {isTranscribing ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons
                                    name={recording ? "stop-circle" : "mic"}
                                    size={24}
                                    color="white"
                                />
                                <Text style={styles.buttonText}>
                                    {recording ? "Stop Recording" : "Start Recording"}
                                </Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background,
    },
    statusCard: {
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        ...theme.shadows.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statusIconContainer: {
        alignSelf: 'center',
        marginBottom: theme.spacing.lg,
        ...theme.shadows.lg,
    },
    statusIconGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    statusContent: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    statusMessage: {
        ...theme.typography.h3,
        color: theme.colors.text,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
    },
    helpText: {
        ...theme.typography.bodySmall,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    recordingStats: {
        alignItems: 'center',
        marginTop: theme.spacing.lg,
    },
    timer: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        fontWeight: '700',
        marginBottom: theme.spacing.md,
    },
    visualizerContainer: {
        width: '100%',
        overflow: 'hidden',
        borderRadius: theme.borderRadius.lg,
    },
    visualizerBackground: {
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
    },
    visualizer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 60,
        gap: 2,
        justifyContent: 'center',
    },
    visualizerBar: {
        width: 3,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.full,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    recordingDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.textSecondary,
        marginRight: theme.spacing.sm,
    },
    recordingDotActive: {
        backgroundColor: theme.colors.status.error,
        shadowColor: theme.colors.status.error,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    resultCard: {
        marginTop: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        backgroundColor: 'rgba(255,255,255,0.8)',
        ...theme.shadows.lg,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    resultTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
    },
    transcribedText: {
        ...theme.typography.body,
        color: theme.colors.text,
        lineHeight: 24,
    },
    mainButton: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        left: theme.spacing.xl,
        right: theme.spacing.xl,
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
        ...theme.shadows.lg,
    },
    buttonGradient: {
        padding: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
    },
    stopButton: {
        transform: [{ scale: 1.05 }],
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        ...theme.typography.button,
        color: 'white',
    },
});