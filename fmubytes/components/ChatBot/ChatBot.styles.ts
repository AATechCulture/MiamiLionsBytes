// components/Chatbot/ChatBot.styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/theme';


type Theme = typeof theme;

export const createChatStyles = (theme: Theme) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  suggestedQuestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // Space between items
    alignItems: 'center',
  },
  cameraButton: {
    width: 44,
    padding: theme.spacing.sm,
    marginRight: theme.spacing.xs,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
  },

  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: theme.spacing.xs,
  },

  suggestionWrapper: {
    marginBottom: 8, // Space between rows
  },

  suggestedQuestionsContent: {
    padding: 12,
    gap: 8,
  },
  suggestionButton: {
    marginHorizontal: 4,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionButtonPressed: {
    opacity: 0.8,
  },
  suggestionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  suggestionText: {
    color: theme.colors.buttonPrimary.text,
    fontSize: 14,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContentContainer: {
    padding: 16,
    gap: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  botMessage: {
    marginRight: '15%',
  },
  userMessage: {
    marginLeft: '15%',
    justifyContent: 'flex-end',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    maxWidth: '85%',
  },
  botMessageBubble: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderTopLeftRadius: 4,
  },
  userMessageBubble: {
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 12,
    lineHeight: 15,
  },
  botMessageText: {
    color: theme.colors.text,
  },
  userMessageText: {
    color: theme.colors.buttonPrimary.text,
  },
  botIconContainer: {
    marginRight: 8,
    marginTop: 4,
  },
  botIconGradient: {
    padding: 8,
    borderRadius: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingTop: 8,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    color: theme.colors.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  sendButtonGradient: {
    padding: 12,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'flex-start',
  },
  typingIndicatorContainer: {
    flexDirection: 'row',
    gap: 4,
    padding: 12,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 16,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  errorText: {
    textAlign: 'center',
    color: theme.colors.status.error,
    fontSize: 16,
    lineHeight: 24,
  },
});