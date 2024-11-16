// components/Text/types.ts
import { TextProps as RNTextProps } from 'react-native';
import { ThemeTypography, ThemeColors } from '../../../theme';

export interface TextProps extends Omit<RNTextProps, 'style'> {
    variant?: keyof ThemeTypography;
    color?: keyof ThemeColors | string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    italic?: boolean;
    style?: RNTextProps['style'];
}