// components/shared/Text/index.tsx
import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { TextProps } from './types';
import { theme } from '../../../theme';

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align,
  italic = false,
  style,
  children,
  ...props
}) => {


  const styles = StyleSheet.create({
    text: {
      ...theme.typography[variant],
      color: color,
      textAlign: align,
      ...(italic && theme.typography.italic),
    },
  });

  return (
    <RNText
      style={[styles.text, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};

