// components/ChatBot.ts


import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  TextInput,
  Pressable,
  Animated,
  Keyboard,
  View,
  Text,
  Image
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { theme } from '@/theme';
import { SUGGESTED_QUESTIONS } from '@/store/constants';
import { checkApiHealth, sendMessage } from '@/services/chat';
import { createChatStyles } from './ChatBot.styles';
import { Message, ChatContext } from './types';


export default function ChatBot({
  isBottomSheetOpen = false
}) {
  const styles = createChatStyles(theme);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const messageFadeAnim = useRef(new Animated.Value(1)).current;
  const loadingFadeAnim = useRef(new Animated.Value(0)).current;

  const scrollViewRef = useRef<ScrollView>(null);

  const [isConnectionError, setIsConnectionError] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatContext] = useState<ChatContext>({
    messages: [],
    userInfo: {
      preferredLanguage: 'en',
      travelHistory: [],
      preferences: {}
    }
  });
  const [pressedChip, setPressedChip] = useState<number | null>(null);
  const chipScale = useRef(new Animated.Value(1)).current;
  const sendButtonScale = useRef(new Animated.Value(1)).current;


  const inputBoxScale = useRef(new Animated.Value(1)).current;

  const animateInputBox = useCallback(() => {
    Animated.sequence([
      Animated.spring(inputBoxScale, {
        toValue: 0.98,
        useNativeDriver: true,
      }),
      Animated.spring(inputBoxScale, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();
  }, [inputBoxScale]);


  const animateSendButton = useCallback(() => {
    Animated.sequence([
      Animated.spring(sendButtonScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(sendButtonScale, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();
  }, [sendButtonScale]);

  const animateChipPress = (index: number, question: string) => {
    setPressedChip(index);
    Animated.sequence([
      Animated.spring(chipScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(chipScale, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start(() => {
      setPressedChip(null);
      handleSendMessage(question);
    });
  };



  const LoadingIndicator = () => {
    const dots = [0, 1, 2];
    const animations = dots.map(() => useRef(new Animated.Value(0)).current);

    useEffect(() => {
      const animate = () => {
        const sequence = dots.map((_, i) =>
          Animated.sequence([
            Animated.delay(i * 150),
            Animated.spring(animations[i], {
              toValue: 1,
              tension: 40,
              friction: 3,
              useNativeDriver: true,
            }),
            Animated.spring(animations[i], {
              toValue: 0,
              tension: 40,
              friction: 3,
              useNativeDriver: true,
            })
          ])
        );

        Animated.loop(
          Animated.parallel(sequence)
        ).start();
      };

      animate();
    }, []);

    return (
      <View style={styles.typingIndicatorContainer}>
        {dots.map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.typingDot,
              {
                transform: [{
                  scale: animations[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  })
                }]
              }
            ]}
          />
        ))}
      </View>
    );
  };

  useEffect(() => {
    if (isBottomSheetOpen) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      checkBackend();
    } else {
      fadeAnim.setValue(0);
    }

    return () => {
      if (!isBottomSheetOpen) {
        setMessages([]);
        setInput('');
        setIsLoading(false);
        setError(null);
        chatContext.messages = [];
      }
    };
  }, [isBottomSheetOpen]);

  const checkBackend = async () => {
    try {
      await checkApiHealth();
      setIsConnectionError(false);

      if (messages.length === 0) {
        const welcomeMessage: Message = {
          content: "I am LegalMate, your personal legal guardian in the palm of your hand. I'm here to ensure your rights are upheld during legal encounters by providing you with real-time support and legal guidance. How can I safeguard your legal journey today?",
          isBot: true,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages([welcomeMessage]);
        chatContext.messages.push(welcomeMessage);
      }
    } catch (error) {
      console.log('API health check failed:', error);
      setIsConnectionError(true);
      setMessages([]);
      chatContext.messages = [];
    }
  };

  const handleImageCapture = async () => {
    try {

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setError('Camera permission is required to use this feature.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        quality: 0.8,
        base64: true,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {

        setInput('');
        setIsLoading(true);
        Keyboard.dismiss();

        const userMessage: Message = {
          content: "What can you tell me about this image?",
          isBot: false,
          timestamp: new Date(),
          type: 'image',
          imageUri: result.assets[0].uri
        };
        setMessages(prev => [...prev, userMessage]);

        const base64Image = result.assets[0].base64 ||
          await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

        // Use existing sendMessage with image
        const data = await sendMessage(
          userMessage.content,
          chatContext.messages.map(msg => ({
            role: msg.isBot ? 'assistant' : 'user',
            content: msg.content
          })),
          chatContext.userInfo,
          base64Image
        );



        const botResponse: Message = {
          content: data.response.text,
          isBot: true,
          timestamp: new Date(data.timestamp),
          type: 'text'
        };
        setMessages(prev => [...prev, botResponse]);
        chatContext.messages.push(botResponse);

      }
    } catch (error) {
      console.error('Error capturing image:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isConnectionError) return;

    Keyboard.dismiss();

    const userMessage: Message = {
      content: messageText,
      isBot: false,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    chatContext.messages.push(userMessage);

    setInput('');
    setIsLoading(true);
    setError(null);

    // Fade in loading indicator
    Animated.timing(loadingFadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    try {
      const messageContext = chatContext.messages.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.content
      }));

      const data = await sendMessage(
        messageText,
        messageContext,
        chatContext.userInfo

      );

      if (!data) {
        throw new Error('No response from chat service');
      }

      // Fade out loading indicator before showing new message
      Animated.sequence([
        Animated.timing(loadingFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(messageFadeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ]).start(() => {
        const botResponse: Message = {
          content: data.response.text,
          isBot: true,
          timestamp: new Date(data.timestamp),
          type: 'text',
          confidence: data.response.confidence
        };

        setMessages(prev => [...prev, botResponse]);
        chatContext.messages.push(botResponse);

        // Fade in new message
        Animated.timing(messageFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        content: "Sorry, I'm having trouble connecting to the service. Please try again later.",
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Animated.View
        style={[
          { flex: 1 },
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }
        ]}
      >
        {isConnectionError ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="warning"
              size={28}
              color={theme.colors.status.error} />
            <Text style={styles.errorText}>
              Unable to connect to the service. Please try again later.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.suggestedQuestionsContainer}>
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.suggestionWrapper,
                    {
                      transform: [{
                        scale: pressedChip === index ? chipScale : 1
                      }]
                    }
                  ]}
                >
                  <Pressable
                    onPress={() => animateChipPress(index, question.query)}
                    style={({ pressed }) => [
                      styles.suggestionButton,
                      pressed && styles.suggestionButtonPressed
                    ]}
                  >
                    <LinearGradient
                      colors={question.gradientColors}
                      style={styles.suggestionGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons
                        name={question.icon as any}
                        size={18}
                        color={theme.colors.buttonPrimary.text} />
                      <Text style={styles.suggestionText}>
                        {question.text}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              ))}
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContentContainer}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((message, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.messageContainer,
                    message.isBot ? styles.botMessage : styles.userMessage,
                    {
                      opacity: messageFadeAnim,
                      transform: [{
                        translateY: messageFadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, 0]
                        })
                      }]
                    }
                  ]}
                >
                  {message.isBot && (
                    <View style={styles.botIconContainer}>
                      <LinearGradient
                        colors={[theme.colors.primary, theme.colors.primaryDark]}
                        style={styles.botIconGradient}
                      >
                        <Ionicons
                          name={message.type === 'error' ? 'warning' : 'rocket'}
                          size={18}
                          color={theme.colors.buttonPrimary.text}
                        />
                      </LinearGradient>
                    </View>
                  )}
                  <View style={[
                    styles.messageBubble,
                    message.isBot ? styles.botMessageBubble : styles.userMessageBubble
                  ]}>
                    {message.type === 'image' && message.imageUri && (
                      <Image
                        source={{ uri: message.imageUri }}
                        style={styles.imageMessage}
                        resizeMode="cover"
                      />
                    )}
                    <Text style={[
                      styles.messageText,
                      message.isBot ? styles.botMessageText : styles.userMessageText
                    ]}>
                      {message.content}
                    </Text>
                  </View>
                </Animated.View>
              ))}

              {isLoading && (
                <Animated.View
                  style={[
                    styles.loadingContainer,
                    {
                      opacity: loadingFadeAnim,
                      transform: [{
                        translateY: loadingFadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, 0]
                        })
                      }]
                    }
                  ]}
                >
                  <LoadingIndicator />
                </Animated.View>
              )}
            </ScrollView>


          </>
        )}
      </Animated.View>
      <Animated.View style={[styles.inputContainer, { transform: [{ scale: inputBoxScale }] }]}>
        <Pressable
          onPress={handleImageCapture}
          style={styles.cameraButton}
        >
          <Ionicons name="camera" size={24} color={theme.colors.primary} />
        </Pressable>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask anything..."
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
          onFocus={animateInputBox}
          multiline
          maxLength={500}
        />

        <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
          <Pressable
            onPress={() => {
              animateSendButton();
              handleSendMessage(input);
            }}
            style={({ pressed }) => [
              styles.sendButton,
              !input.trim() && styles.sendButtonDisabled,
              pressed && styles.sendButtonPressed
            ]}
            disabled={!input.trim()}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons
                name="send"
                size={22}
                color={theme.colors.buttonPrimary.text}
              />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </>
  );
}
